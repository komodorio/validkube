import React, { createContext, useState, useEffect } from "react";
import { light, dark } from "../../utils/Themes";

interface ThemeContextInterface {
  currentTheme: string;
  setCurrentTheme: React.Dispatch<React.SetStateAction<string>>;
  theme: string;
}
export const ThemePreference = createContext<ThemeContextInterface | null>(
  null
);

type ThemesContextProviderProps = {
  children: React.ReactNode;
};

export const ThemesContext = ({ children }: ThemesContextProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<String | null | any>("dark");
  const themesMap: any = { light, dark };
  const theme = themesMap[currentTheme];
  useEffect(() => {
    const themeQuery = window.matchMedia("(prefers-color-scheme: light)");
    setCurrentTheme(themeQuery.matches ? "light" : "dark");
    themeQuery.addEventListener("change", ({ matches }) => {
      setCurrentTheme(matches ? "light" : "dark");
    });
  }, []);
  return (
    <ThemePreference.Provider value={{ currentTheme, setCurrentTheme, theme }}>
      {children}
    </ThemePreference.Provider>
  );
};
