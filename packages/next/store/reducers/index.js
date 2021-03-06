import { combineReducers } from "@reduxjs/toolkit";

import chainReducer from "./chainSlice";
import toastReducer from "./toastSlice";
import preferenceReducer from "./preferenceSlice";
import themeReducer from "./themeSlice";

export default combineReducers({
  chain: chainReducer,
  toast: toastReducer,
  preference: preferenceReducer,
  theme: themeReducer,
});
