import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./menuSlice";
import toolBoxReducer from "./toolBoxSlice";

const appStore = configureStore(
  {
    reducer: {
      menu: menuReducer,
      toolbox: toolBoxReducer
    }
  }
);

export default appStore;