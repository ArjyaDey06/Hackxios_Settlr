import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => {
            navigate("/");
            setIsOpen(false);
          }}
          className="text-2xl font-bold cursor-pointer text-gray-900"
        >
          Settlr
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            // Show Sign Out button when user is logged in
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-white text-emerald-600 border border-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white hover:scale-105 transition-all duration-200 flex items-center gap-2 font-bold"
            >
              <img src="/exit_198141.png" alt="Sign Out" className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            // Show Login and Sign Up buttons when user is logged out
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-emerald-600 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-6 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all duration-200 font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-sm">
          <div className="flex flex-col px-4 py-4 space-y-4">
            {user ? (
              // Show Sign Out button when user is logged in
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-white text-emerald-600 border border-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white hover:scale-105 transition-all duration-200 text-left flex items-center gap-2 font-bold"
              >
                <img src="/exit_198141.png" alt="Sign Out" className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              // Show Login and Sign Up buttons when user is logged out
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:text-emerald-600 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all duration-200 font-medium text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
