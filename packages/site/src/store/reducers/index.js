import { combineReducers } from "@reduxjs/toolkit";

import nodeReducer from "./nodeSlice";
import chainReducer from "./chainSlice";

export default combineReducers({
  node: nodeReducer,
  chain: chainReducer,
});
