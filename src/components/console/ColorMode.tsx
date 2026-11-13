"use client";

import { useSyncExternalStore } from "react";
import { Theme } from "@astryxdesign/core/theme";
import { themes, defaultThemeSlug } from "@/astryx-themes";

type Mode = "light" | "dark";
const KEY = "portfolio-color-mode";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function snapshot(): Mode {
  try {
    return localStorage.getItem(KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function useColorMode() {
  const mode = useSyncExternalStore(subscribe, snapshot, () => "dark" as Mode);
  const toggle = () => {
    try {
      localStorage.setItem(KEY, mode === "dark" ? "light" : "dark");
    } catch {
      /* storage can be blocked; the toggle simply won't persist */
    }
    listeners.forEach((l) => l());
  };
  return { mode, toggle };
}

export function Providers({ children }: { children: React.ReactNode }) {
  const { mode } = useColorMode();
  return (
    <Theme theme={themes[defaultThemeSlug]} mode={mode}>
      <div className="brand">{children}</div>
    </Theme>
  );
}
