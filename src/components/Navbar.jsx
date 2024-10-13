import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../src/assets/enerxchangedark.png";

function Navbar({ account }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <img src={logo} alt="logo" className="h-8 w-8 mr-2" />
                <span className="font-semibold text-gray-500 text-lg">
                  EnerXchange
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/owner"
                className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300"
              >
                Dashboard
              </Link>
              <Link
                to="/sell"
                className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300"
              >
                Sell Energy
              </Link>
              <Link
                to="/buy"
                className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300"
              >
                Buy Energy
              </Link>
            </div>
          </div>

          {/* Account info always visible */}
          <div className="flex items-center space-x-3">
            <span className="py-2 px-2 md:font-medium font-sm text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300 ">
              {account
                ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
                : "Not Connected"}
            </span>

            {/* Hamburger menu icon (only for mobile) */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu}>
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
          <Link
            to="/owner"
            className="block py-2 px-4 text-sm hover:bg-green-500"
          >
            Dashboard
          </Link>
          <Link
            to="/sell"
            className="block py-2 px-4 text-sm hover:bg-green-500"
          >
            Sell Energy
          </Link>
          <Link
            to="/buy"
            className="block py-2 px-4 text-sm hover:bg-green-500"
          >
            Buy Energy
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
