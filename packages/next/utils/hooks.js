import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import {
  nodes,
  DEFAULT_THEME_COLOR,
  DEFAULT_THEME_COLOR_SECONDARY,
  DEFAULT_THEME_BUTTON_COLOR,
  DEFAULT_THEME_LOGO,
} from "utils/constants";

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
  return router.pathname === "/" && router.asPath !== "/404";
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        // width: window.screen.width,
        // height: window.screen.height,
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
  const node = process.env.NEXT_PUBLIC_CHAIN;
  if (nodes.findIndex((item) => item.value === node) >= 0) {
    return node;
  }
  return null;
}

export function useTheme() {
  const node = useNode();
  const nodeConfig = (nodes || []).find((item) => item.value === node);
  const color = nodeConfig?.color ?? DEFAULT_THEME_COLOR;
  const colorSecondary =
    nodeConfig?.colorSecondary ?? DEFAULT_THEME_COLOR_SECONDARY;
  const buttonColor = nodeConfig?.buttonColor ?? DEFAULT_THEME_BUTTON_COLOR;
  const logo = nodeConfig?.logo ?? DEFAULT_THEME_LOGO;
  return {
    color,
    colorSecondary,
    buttonColor,
    logo,
  };
}

export function getSymbol(node) {
  return nodes.find((item) => item.value === node)?.symbol;
}
