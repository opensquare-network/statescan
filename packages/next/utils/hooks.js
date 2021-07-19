import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

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
  const router = useRouter();
  return router.pathname === "/[node]" && router.asPath !== "/404";
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.visualViewport.width,
        height: window.visualViewport.height,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

export function useNode() {
  const router = useRouter();
  const match = router.asPath.match(/\/([^\/]+)(\/|)/);
  if (match) {
    const node = match[1];
    if (nodes.findIndex((item) => item.value === node) >= 0) {
      return node;
    }
  }
  return null;
}

export function getSymbol(node) {
  return nodes.find((item) => item.value === node)?.symbol;
}
