import React from "react";
import { motion } from "framer-motion";

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-blue-700 text-white py-4 shadow-lg"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.h1
          className="text-3xl font-extrabold"
          whileHover={{ scale: 1.1, color: "#E2E8F0" }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
    
        </motion.h1>
       
      </div>
    </motion.header>
  );
}

export default Header;
