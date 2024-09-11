import React, { useEffect } from "react";
import { Header, Footer, Navbar } from "./components";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks";

function App() {
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
    <>
      <Header />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
