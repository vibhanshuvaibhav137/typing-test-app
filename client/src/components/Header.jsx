import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const Header = () => {
  const [dark, setDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Check for token first
        const token = localStorage.getItem("authToken");
        
        if (token) {
          // Verify token with the server
          const response = await api.post("/current-user");
          if (response.data) {
            setIsLoggedIn(true);
          } else {
            // If the server response indicates the token is invalid
            localStorage.removeItem("authToken");
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    // You might also want to redirect to the login page
  };

  return (
    <header className="flex justify-between items-center p-4 shadow bg-white dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-primary">Typing Test</h1>
      <div className="flex items-center gap-4">
        <button onClick={() => setDark(!dark)} className="bg-secondary px-3 py-1 rounded text-white">
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
        
        {isLoggedIn ? (
          // Show these links when user is logged in
          <>
            <Link to="/dashboard" className="text-accent font-medium">Dashboard</Link>
            <button onClick={handleLogout} className="text-accent font-medium">Logout</button>
          </>
        ) : (
          // Show these links when user is not logged in
          <>
            <Link to="/login" className="text-accent font-medium">Log in</Link>
            <Link to="/register" className="text-accent font-medium">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;