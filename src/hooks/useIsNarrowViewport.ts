import { useSyncExternalStore } from "react";
import { MEDIA_MAX_NARROW } from "@/constants/layoutBreakpoint";

const QUERY = MEDIA_MAX_NARROW;

function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/** True below desktop layout breakpoint (under 1024px / Tailwind below `lg`) — e.g. lighter video preload. */
export function useIsNarrowViewport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
