import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { UI_THEME_STORAGE_KEY } from "@/constants/uiTheme";

export type UiColorMode = "dark" | "light";

interface UiThemeContextValue {
  mode: UiColorMode;
  setMode: (m: UiColorMode) => void;
  toggleMode: () => void;
}

const UiThemeContext = createContext<UiThemeContextValue | null>(null);

function readStoredMode(): UiColorMode | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(UI_THEME_STORAGE_KEY);
  if (v === "light" || v === "dark") return v;
  return null;
}

export function UiThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<UiColorMode>(() => {
    if (typeof window === "undefined") return "dark";
    return readStoredMode() ?? "dark";
  });

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-ui-theme", mode);
    try {
      localStorage.setItem(UI_THEME_STORAGE_KEY, mode);
    } catch {
      /* ignore quota / private mode */
    }
  }, [mode]);

  const setMode = (m: UiColorMode) => setModeState(m);
  const toggleMode = () =>
    setModeState((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <UiThemeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </UiThemeContext.Provider>
  );
}

export function useUiTheme(): UiThemeContextValue {
  const ctx = useContext(UiThemeContext);
  if (!ctx) {
    throw new Error("useUiTheme must be used within UiThemeProvider");
  }
  return ctx;
}
