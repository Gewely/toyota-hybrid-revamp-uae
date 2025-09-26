import { useEffect, useRef } from "react";

let bodyScrollLockCount = 0;
let previousOverflow: string | null = null;

/**
 * Locks body scrolling while `active` is true.
 * Uses a reference count so multiple modals can be open simultaneously
 * without unlocking the body prematurely.
 */
export function useBodyScrollLock(active: boolean) {
  const isLocked = useRef(false);

  useEffect(() => {
    if (!active || typeof document === "undefined") {
      return;
    }

    const { body } = document;
    if (!body) {
      return;
    }

    if (!isLocked.current) {
      if (bodyScrollLockCount === 0) {
        previousOverflow = body.style.overflow;
        body.style.overflow = "hidden";
      }

      bodyScrollLockCount += 1;
      isLocked.current = true;
    }

    return () => {
      if (!isLocked.current || typeof document === "undefined") {
        return;
      }

      const { body } = document;
      bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);

      if (bodyScrollLockCount === 0 && body) {
        body.style.overflow = previousOverflow ?? "";
        previousOverflow = null;
      }

      isLocked.current = false;
    };
  }, [active]);
}
