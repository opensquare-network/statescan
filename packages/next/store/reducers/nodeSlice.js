import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_NODE = "westmint";

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    node: DEFAULT_NODE,
  },
  reducers: {
    setNode(state, { payload }) {
      state.node = payload;
    },
  },
});

export const { setNode } = nodeSlice.actions;

export const nodeSelector = (state) => state.node.node;

export default nodeSlice.reducer;
