const tintColorLight = '#4f46e5';
const tintColorDark = '#818cf8'; // A lighter indigo for dark mode text/icons

export const Colors = {
  light: {
    text: '#111827',
    background: '#f8fafc',
    tint: tintColorLight,
    icon: '#68798a',
    tabIconDefault: '#68798a',
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    border: '#e5e7eb',
  },
  dark: {
    // NEW "NAVY" THEME
    text: '#e2e8f0', // Lighter text for contrast
    background: '#0f172a', // Deep navy blue
    tint: tintColorDark,
    icon: '#94a3b8',
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorDark,
    card: '#1e293b', // Slate blue for cards
    border: '#334155', // Slightly lighter border
  },
};