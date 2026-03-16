\"use client\";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from \"react\";

type Theme = \"light\" | \"dark\";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: \"light\",
  toggleTheme: () => {},
});

function getInitialTheme(): Theme {
  if (typeof window === \"undefined\") return \"light\";
  try {
    const stored = window.localStorage.getItem(\"publiseo-theme\");
    if (stored === \"light\" || stored === \"dark\") return stored;
  } catch {
    // ignore
  }
  if (window.matchMedia && window.matchMedia(\"(prefers-color-scheme: dark)\").matches) {
    return \"dark\";
  }
  return \"light\";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    try {
      window.localStorage.setItem(\"publiseo-theme\", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === \"light\" ? \"dark\" : \"light\"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

