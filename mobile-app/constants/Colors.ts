const tintColorLight = '#4f46e5';
const tintColorDark = '#818cf8'; // A lighter, vibrant indigo for dark mode accents

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
    // NEW "NAVY" THEME, inspired by your screenshot
    text: '#e2e8f0', // A soft off-white for text
    background: '#0f172a', // Deep navy blue background
    tint: tintColorDark,
    icon: '#94a3b8',
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorDark,
    card: '#1e293b', // Rich slate blue for cards and surfaces
    border: '#334155', // A subtle border color
  },
};