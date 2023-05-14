import * as React from "react";

export default function useThrottle(cb: (...arg: any[]) => void, gap: number) {
  const shouldWaitRef = React.useRef(false);
  const callbackRef = React.useRef(cb);

  React.useLayoutEffect(() => {
    callbackRef.current = cb;
  });

  return React.useCallback(
    (...args: any[]) => {
      if (shouldWaitRef.current) return;
      callbackRef.current(...args);
      shouldWaitRef.current = true;
      setTimeout(() => {
        shouldWaitRef.current = false;
      }, gap);
    },
    [gap]
  );
}
