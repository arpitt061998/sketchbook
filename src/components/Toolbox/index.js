import { COLORS } from "@/utils/constants";
import styles from './index.module.css';

const ToolBox = () => {
  const updateBrushSize = (e) => {}

  return (
    <div className={styles.toolboxContainer}>
      <div className={styles.toolItem}>
        <h4 className={styles.toolText}>Stroke Color</h4>
        <div className={styles.itemsContainer}>
          {Object.keys(COLORS).map(colorKey => (
            <div
              key={colorKey}
              className={styles.colorBox}
              style={{ backgroundColor: COLORS[colorKey] }}
            ></div>
          ))}
        </div>
      </div>
      <div className={styles.toolItem}>
        <h4 className={styles.toolText}>Brush Size</h4>
        <div className={styles.toolContainer}>
          <input type="range" min={1} max={10} step={1} onChange={updateBrushSize}/>
        </div>
      </div>
    </div>
  )
}
  
export default ToolBox;