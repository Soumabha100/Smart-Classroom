import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from "react-native-paper";
import { Colors } from "../constants/Colors";

// Augment the PaperTheme type to include our custom colors for type safety
declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      card: string;
      border: string;
    }
  }
}

// Create our custom, fully-typed themes
const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.tint,
    background: Colors.light.background,
    surface: Colors.light.card,
    card: Colors.light.card,
    border: Colors.light.border,
  },
};

const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.tint,
    background: Colors.dark.background,
    surface: Colors.dark.card,
    card: Colors.dark.card,
    border: Colors.dark.border,
  },
};

// Define the precise type of our theme
type AppTheme = typeof LightTheme;

interface ThemeContextType {
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
  theme: AppTheme; // The theme object is now fully typed
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const deviceScheme = useDeviceColorScheme() ?? "light";
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    deviceScheme
  );

  useEffect(() => {
    const loadTheme = async () => {
      const savedScheme = await AsyncStorage.getItem("colorScheme");
      if (savedScheme === "light" || savedScheme === "dark") {
        setColorScheme(savedScheme);
      }
    };
    loadTheme();
  }, []);

  const toggleColorScheme = async () => {
    const newScheme = colorScheme === "light" ? "dark" : "light";
    setColorScheme(newScheme);
    await AsyncStorage.setItem("colorScheme", newScheme);
  };

  const theme = useMemo(
    () => (colorScheme === "light" ? LightTheme : DarkTheme),
    [colorScheme]
  );

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme, theme }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

// This is now the ONLY theme hook for the entire app. It's clean and type-safe.
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
