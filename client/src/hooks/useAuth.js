import { useState, useEffect } from 'react';

export default function useAuth() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // This effect runs once when the hook is used, and gets the role from localStorage
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return { role };
}