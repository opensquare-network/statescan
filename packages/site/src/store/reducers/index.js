import { combineReducers } from "@reduxjs/toolkit";

import nodeReducer from "./nodeSlice";

export default combineReducers({
  node: nodeReducer,
});
