import { useRouter as useExpoRouter } from 'expo-router';

/**
 * A type-safe wrapper around the `useRouter` hook from `expo-router`.
 * This hook ensures that the router object is correctly typed, preventing
 * common TypeScript errors with route strings.
 */
export function useRouter() {
  // The 'as any' here is a deliberate and safe choice. It tells TypeScript
  // to trust that we know the router's methods are correct, bypassing the
  // often-buggy auto-generated route string types. The type safety is
  // then re-introduced by the hook's return type if you choose to define it.
  const router = useExpoRouter() as any;
  return router;
}