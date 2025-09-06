import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MD3LightTheme,
  MD3DarkTheme,
  PaperProvider,
} from "react-native-paper";
import { Colors } from "../constants/Colors";

// Define the custom theme properties we want to add
const customProperties = {
  card: "string",
  border: "string",
};

// Augment the PaperTheme type to include our custom properties
declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      card: typeof customProperties.card;
      border: typeof customProperties.border;
    }
  }
}

// Create our custom themes by extending the defaults from React Native Paper
const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.tint,
    background: Colors.light.background,
    surface: Colors.light.card,
    // Custom colors
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
    // Custom colors
    card: Colors.dark.card,
    border: Colors.dark.border,
  },
};

// Export the theme type for our custom hook
export type AppTheme = typeof LightTheme;

interface ThemeContextType {
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
  paperTheme: AppTheme;
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

  const paperTheme = useMemo(() => {
    return colorScheme === "light" ? LightTheme : DarkTheme;
  }, [colorScheme]);

  return (
    <ThemeContext.Provider
      value={{ colorScheme, toggleColorScheme, paperTheme }}
    >
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
