import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/.auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.clientPrincipal || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch auth state:", err);
        setLoading(false);
      });
  }, []);

  return { user, loading };
}
