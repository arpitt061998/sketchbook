import { MENU_ITEMS } from "@/utils/constants";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector,useDispatch } from "react-redux";
import { actionItemClick, menuItemClick } from "@/utils/menuSlice";
import { socket } from "@/socket";
import { config } from "@fortawesome/fontawesome-svg-core";

const Board = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const drawHistory = useRef([]);
  const historyPointer = useRef(0);
  const shouldDraw = useRef(false);
  const {activeMenuItem, actionMenuItem} = useSelector((state) => state.menu)
  const {color,size} = useSelector((state) => state.toolbox[activeMenuItem]);

  useEffect(()=> {
    if(!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    console.log(actionMenuItem)
  if(actionMenuItem === MENU_ITEMS.DOWNLOAD){
      const URL = canvas.toDataURL();
      const anchor = document.createElement("a");
      anchor.download = 'sketch.jpg';
      anchor.href = URL;
      anchor.click();
    } else if(actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO) {
      if(historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) historyPointer.current -= 1;
      if(historyPointer.current < drawHistory.current.length - 1 && actionMenuItem === MENU_ITEMS.REDO) historyPointer.current += 1;
      const imgData = drawHistory.current[historyPointer.current];
      console.log(imgData);
      context.putImageData(imgData, 0, 0);
    }
    dispatch(actionItemClick(null))
  },[actionMenuItem,dispatch]);

  useEffect(()=> {
    if(!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const changeConfig = (color,size) => {
      context.strokeStyle = color;
      context.lineWidth = size;
    };  
    const handleChangeConfig = (config) =>{
      console.log("config is ==>",config)
      changeConfig(config.color, config.size);
    }
    changeConfig(color,size);

    socket.on("changeConfig", handleChangeConfig);

    return () => {
      socket.off("changeConfig", handleChangeConfig);
    }
  },[color,size]);

  // before browser paint
  useLayoutEffect(() => {
    if(!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    //while mounting
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const beginPath = (x,y) => {
      context.beginPath();
      context.moveTo(x,y);
    }
    const drawPath = (x,y) => {
      context.lineTo(x,y);
      context.stroke();
    }

    const handleMouseDown = (e) => {
      shouldDraw.current = true;
      beginPath(e.clientX,e.clientY);
      socket.emit("beginPath", {x:e.clientX, y:e.clientY});
    };

    const handleMouseUp = (e) => {
      shouldDraw.current = false;
      const imgData = context.getImageData(0,0, canvas.width, canvas.height);
      drawHistory.current.push(imgData);
      historyPointer.current = drawHistory.current.length - 1;
    };

    const handleMouseMove = (e) => {
      if(!shouldDraw.current) return;
      drawPath(e.clientX,e.clientY);
      socket.emit("drawPath", {x:e.clientX, y:e.clientY});
    };

    // socket.on("connect", () => {
    //   console.log("client connected");
    // })

    const handleBeginPath = (path) => {
      beginPath(path.x,path.y);
    };

    const handleDrawPath = (path) => {
      drawPath(path.x,path.y);
    };

    socket.on('beginPath',handleBeginPath);
    socket.on('drawPath',handleDrawPath);


    canvas.addEventListener('mousedown',handleMouseDown);
    canvas.addEventListener('mouseup',handleMouseUp);    
    canvas.addEventListener('mousemove',handleMouseMove);    

    return () => {
      canvas.removeEventListener('mousedown',handleMouseDown);
      canvas.removeEventListener('mouseup',handleMouseUp);    
      canvas.removeEventListener('mousemove',handleMouseMove);
      socket.off('beginPath',handleBeginPath);
      socket.off('drawPath',handleDrawPath);
    }
  },[]);

  console.log("loaded", color,size);
  return (
    <canvas ref={canvasRef}></canvas>
  )
};

export default Board;