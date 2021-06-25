import { combineReducers } from "@reduxjs/toolkit";

import nodeReducer from "./nodeSlice";
import chainReducer from "./chainSlice";
import toastReducer from "./toastSlice";
import preferenceReducer from "./preferenceSlice";

export default combineReducers({
  node: nodeReducer,
  chain: chainReducer,
  toast: toastReducer,
  preference: preferenceReducer,
});
