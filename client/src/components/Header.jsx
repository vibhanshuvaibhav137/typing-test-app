import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="flex justify-between items-center p-4 shadow bg-white dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-primary">Typing Test</h1>
      <div className="flex items-center gap-4">
        <button onClick={() => setDark(!dark)} className="bg-secondary px-3 py-1 rounded text-white">
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
        <Link to="/login" className="text-accent font-medium">Log in</Link>
        <Link to="/register" className="text-accent font-medium">Register</Link>
      </div>
    </header>
  );
};

export default Header;
