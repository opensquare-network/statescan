import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_NODE = "westmint";

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

export const setStoredOrDefaultNode = () => (dispatch) => {
  const storedNode = window.localStorage.getItem("node");
  const node = storedNode ? JSON.parse(storedNode) : DEFAULT_NODE;
  dispatch(setNode(node));
};

export const nodeSelector = (state) => state.node.node;

export default nodeSlice.reducer;
