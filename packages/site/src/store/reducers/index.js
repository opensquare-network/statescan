import { combineReducers } from "@reduxjs/toolkit";

import nodeReducer from "./nodeSlice";
import chainReducer from "./chainSlice";
import toastReducer from "./toastSlice";

export default combineReducers({
  node: nodeReducer,
  chain: chainReducer,
  toast: toastReducer,
});
