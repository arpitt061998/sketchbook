import { COLORS, MENU_ITEMS } from "@/utils/constants";
import styles from './index.module.css';
import { useSelector,useDispatch } from "react-redux";
import { changeColor, changeBrushSize } from "@/utils/toolBoxSlice";
import { socket } from "@/socket";

const ToolBox = () => {
  const dispatch = useDispatch();
  const activeMenuItem= useSelector((state) => state.menu.activeMenuItem);
  console.log(activeMenuItem)
  const showStrokeToolOption = activeMenuItem === MENU_ITEMS.PENCIL;
  const showBrushToolOption = activeMenuItem === MENU_ITEMS.PENCIL || MENU_ITEMS.ERASER;
  const {color,size} = useSelector((state) => state.toolbox[activeMenuItem]);

  const updateBrushSize = (e) => {
    dispatch(changeBrushSize({
      item:activeMenuItem,
      size:e.target.value
    }))
    socket.emit('changeConfig',{color,size:e.target.value});
  };

  const updateColor = (color) => {
    dispatch(changeColor({
      item:activeMenuItem,
      color:color
    }))
    socket.emit('changeConfig',{color:color,size});
  };

  return (
    <div className={styles.toolboxContainer}>
      {showStrokeToolOption && <div className={styles.toolItem}>
        <h4 className={styles.toolText}>Stroke Color</h4>
        <div className={styles.itemsContainer}>
          {Object.keys(COLORS).map(colorKey => (
            <div
              key={colorKey}
              className={styles.colorBox}
              style={{ backgroundColor: COLORS[colorKey]}}
              onClick={() => updateColor(COLORS[colorKey])}
            ></div>
          ))}
        </div>
      </div>}
      
      {showBrushToolOption && <div className={styles.toolItem}>
        <h4 className={styles.toolText}>Brush Size</h4>
        <div className={styles.toolContainer}>
          <input type="range" min={1} max={10} step={1} onChange={updateBrushSize} value={size}/>
        </div>
      </div>}
    </div>
  )
}
  
export default ToolBox;