import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useNode } from "utils/hooks";
import { useDispatch } from "react-redux";
import { setStoredOrDefaultNode } from "../store/reducers/nodeSlice";

export default function Root() {
  const history = useHistory();
  const node = useNode();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!node) {
      dispatch(setStoredOrDefaultNode());
    } else {
      history.push(`/${node}`);
    }
  }, [node, history, dispatch]);
  return null;
}
