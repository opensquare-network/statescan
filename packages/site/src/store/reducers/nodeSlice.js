import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_NODE = "polkadot";

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    node: null,
  },
  reducers: {
    setNode(state, { payload }) {
      state.node = payload;
      window.localStorage.setItem("node", JSON.stringify(payload));
    },
  },
});

export const { setNode } = nodeSlice.actions;

export const nodeSelector = (state) => {
  if (state.node.node) {
    return state.node.node;
  } else {
    const storedNode = window.localStorage.getItem("node");
    const node = storedNode ? JSON.parse(storedNode) : DEFAULT_NODE;
    setNode(node);
    return node;
  }
};

export default nodeSlice.reducer;
