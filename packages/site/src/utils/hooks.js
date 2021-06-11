import { useCallback, useState, useEffect, useRef } from "react";

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
