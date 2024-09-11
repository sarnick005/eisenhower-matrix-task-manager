import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loading, login, logout };
}
export default useAuth;
