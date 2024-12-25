import { createContext, ReactNode, useContext, useEffect, useState } from "react"

type theme = 'light' | 'dark';
interface ThemeContextType {
  theme: theme,
  toggleTheme: () => void,
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  return context as ThemeContextType;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<theme>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as theme;
    setTheme(storedTheme);
    document.documentElement.classList.toggle('dark', storedTheme === 'dark')

  }, []);

  function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )

}
