import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { nodeSelector, setStoredOrDefaultNode } from "store/reducers/nodeSlice";

export default function App({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setStoredOrDefaultNode());
  });

  return <>{children}</>;
}
