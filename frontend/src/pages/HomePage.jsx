import React, { useEffect } from "react";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
function HomePage() {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate("/");
      }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
      return <div>Loading...</div>;
    }
  return (
    <div>
      <h3>Home page</h3>
    </div>
  );
}

export default HomePage;
