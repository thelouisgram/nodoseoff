import React, { createContext, useContext, useEffect, useState } from "react";
import { useUpdateThemeMutation, useUserTheme } from "@/hooks/useDashboardData";
import { useAppStore } from "@/store/useAppStore";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAppStore((state) => state);

  // Get theme from database
  const { data: savedTheme, isLoading: isLoadingTheme } = useUserTheme(userId);
  const updateThemeMutation = useUpdateThemeMutation();

  // Initialize with system preference, then override with saved theme
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  // Sync with saved theme from database when it loads
  useEffect(() => {
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [savedTheme]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Save to database if user is logged in
    if (userId) {
      updateThemeMutation.mutate({ userId, theme: newTheme });
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isLoading: isLoadingTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
