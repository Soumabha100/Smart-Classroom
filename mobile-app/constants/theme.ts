import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { Colors } from './Colors'; // Your existing Colors file

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4f46e5', // A nice indigo color like your website
    secondary: '#10b981', // An accent green
    background: '#f8fafc', // A light gray background
    surface: '#ffffff', // Card backgrounds
    text: '#1e293b', // Dark slate for text
    placeholder: '#94a3b8',
  },
};