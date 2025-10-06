import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    onLogout(); // optional if App.js manages state
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-roastedPeach to-cream shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        <Link className="text-xl font-bold text-milkyCoffee" to="/">Internship Portal</Link>

        {/* Hamburger for mobile */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        {/* Links */}
        <ul className={`md:flex space-x-6 ${isOpen ? "block" : "hidden"} md:block`}>
          <li><Link className="hover:text-eucalyptus" to="/">Home</Link></li>
          {!isLoggedIn && (
            <>
              <li><Link className="hover:text-eucalyptus" to="/signup">Signup</Link></li>
              <li><Link className="hover:text-eucalyptus" to="/login">Login</Link></li>
            </>
          )}
          {isLoggedIn && (
            <>
              <li><Link className="hover:text-eucalyptus" to="/dashboard">Dashboard</Link></li>
              <li><Link className="hover:text-eucalyptus" to="/profile">Profile</Link></li>
              <li>
                <button className="bg-milkyCoffee text-white px-4 py-1 rounded" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
