import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import axios from "axios";
import { motion } from "framer-motion";

function Navbar() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentUserDetails = async () => {
      try {
        const response = await axios.get("/api/v1/user/current-user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    if (isAuthenticated) {
      getCurrentUserDetails();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 text-white py-4"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            TaskMaster
          </Link>
          <div className="space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                to="/"
                className="hover:text-gray-300 transition-colors duration-300"
              >
                Home
              </Link>
            </motion.button>
            {!isAuthenticated ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    to="/signup"
                    className="hover:text-gray-300 transition-colors duration-300"
                  >
                    Sign Up
                  </Link>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    to="/login"
                    className="hover:text-gray-300 transition-colors duration-300"
                  >
                    Login
                  </Link>
                </motion.button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {user && <p className="text-sm">Welcome, {user.username}!</p>}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors duration-300"
                >
                  Logout
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    to="/task"
                    className="hover:text-gray-300 transition-colors duration-300"
                  >
                    Tasks
                  </Link>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
