import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useNode } from "utils/hooks";

export default function Root() {
  const history = useHistory();
  const node = useNode();
  useEffect(() => {
    history.push(`/${node}`);
  }, [node, history]);
  return null;
}
