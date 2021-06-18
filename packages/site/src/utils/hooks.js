import { useCallback, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { matchPath } from "react-router";
import { useSelector } from "react-redux";

import { nodeSelector } from "store/reducers/nodeSlice";
import { nodes } from "utils/constants";

export function useToggle(initalState = false) {
  const [state, setState] = useState(initalState);
  const toggle = useCallback(() => setState((state) => !state), []);
  return [state, toggle];
}

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  });
}

export function useIsMounted() {
  const isMountedRef = useRef(true);
  const isMounted = useCallback(() => isMountedRef.current, []);
  useEffect(() => {
    return () => void (isMountedRef.current = false);
  }, []);
  return isMounted;
}

export function useHomePage() {
  const location = useLocation();
  const match = matchPath(location.pathname, {
    path: "/:node",
    exact: true,
    strict: false,
  });
  return !!match;
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

export function useNode() {
  const node = useSelector(nodeSelector);
  return node;
}

export function useSymnol() {
  const [symbol, setSymbol] = useState();
  const node = useNode();
  useEffect(() => {
    setSymbol(nodes.find((item) => item.value === node)?.symbol);
  }, [node]);
  return symbol;
}
