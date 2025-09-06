import { useTheme as usePaperTheme } from 'react-native-paper';
import { theme } from '../constants/theme';

export type AppTheme = typeof theme;

/**
 * A type-safe hook for accessing the application's theme.
 * This should be used in place of the default useTheme from react-native-paper
 * to get proper type support for your custom colors.
 */
export const useAppTheme = () => usePaperTheme<AppTheme>();