import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type ProductTheme =
  | "default"
  | "cooling"
  | "heating"
  | "fire"
  | "heatpump"
  | "boiler";

interface ThemeConfig {
  accent: string;
  glow: string;
  gradient: string;
  particle: string;
}

const THEMES: Record<ProductTheme, ThemeConfig> = {
  default: {
    accent: "#0a1628",
    glow: "rgba(10,22,40,0.3)",
    gradient:
      "radial-gradient(ellipse at 50% 0%, rgba(10,22,40,0.15) 0%, transparent 70%)",
    particle: "#0a1628",
  },
  cooling: {
    accent: "#00d4ff",
    glow: "rgba(0,212,255,0.25)",
    gradient:
      "radial-gradient(ellipse at 70% 20%, rgba(0,212,255,0.12) 0%, transparent 60%)",
    particle: "#00d4ff",
  },
  heating: {
    accent: "#ff6b00",
    glow: "rgba(255,107,0,0.25)",
    gradient:
      "radial-gradient(ellipse at 30% 20%, rgba(255,107,0,0.12) 0%, transparent 60%)",
    particle: "#ff6b00",
  },
  fire: {
    accent: "#ff2020",
    glow: "rgba(255,32,32,0.2)",
    gradient:
      "radial-gradient(ellipse at 50% 30%, rgba(255,32,32,0.1) 0%, transparent 60%)",
    particle: "#ff4444",
  },
  heatpump: {
    accent: "#00ff88",
    glow: "rgba(0,255,136,0.2)",
    gradient:
      "radial-gradient(ellipse at 60% 10%, rgba(0,255,136,0.1) 0%, transparent 60%)",
    particle: "#00ff88",
  },
  boiler: {
    accent: "#ffbf00",
    glow: "rgba(255,191,0,0.2)",
    gradient:
      "radial-gradient(ellipse at 40% 20%, rgba(255,191,0,0.1) 0%, transparent 60%)",
    particle: "#ffbf00",
  },
};

interface ThemeContextValue {
  theme: ProductTheme;
  config: ThemeConfig;
  setTheme: (t: ProductTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "default",
  config: THEMES.default,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ProductTheme>("default");

  const setTheme = (t: ProductTheme) => {
    setThemeState(t);
  };

  useEffect(() => {
    const cfg = THEMES[theme];
    const root = document.documentElement;
    root.style.setProperty("--accent", cfg.accent);
    root.style.setProperty("--glow", cfg.glow);
    root.style.setProperty("--bg-gradient", cfg.gradient);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, config: THEMES[theme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
