import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { nodeSelector } from "store/reducers/nodeSlice";

export default function Root() {
  const history = useHistory();
  const node = useSelector(nodeSelector);
  useEffect(() => {
    history.push(`/${node}`);
  }, [node, history]);
  return null;
}
