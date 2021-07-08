import { createSlice } from "@reduxjs/toolkit";
import { timeTypes } from "utils/constants";

const DEFAULT_TIMETYPE = timeTypes.age;

const preferenceSlice = createSlice({
  name: "preference",
  initialState: {
    // timeType: window.localStorage.getItem("timeType") || DEFAULT_TIMETYPE
    timeType: DEFAULT_TIMETYPE,
  },
  reducers: {
    setTimeType(state, { payload }) {
      window.localStorage.setItem("timeType", payload);
    },
  },
});

export const { setTimeType } = preferenceSlice.actions;

export const timeTypeSelector = (state) => state.preference.timeType;

export default preferenceSlice.reducer;
