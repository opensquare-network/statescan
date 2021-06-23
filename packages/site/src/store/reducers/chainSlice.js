import { createSlice } from "@reduxjs/toolkit";

const chainSlice = createSlice({
  name: "chain",
  initialState: {
    scanHeight: 0,
  },
  reducers: {
    setScanHeight(state, { payload }) {
      state.scanHeight = payload;
    },
  },
});

export const { setScanHeight } = chainSlice.actions;

export const scanHeightSelector = (state) => state.chain.scanHeight;

export default chainSlice.reducer;
