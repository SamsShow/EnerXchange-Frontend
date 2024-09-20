import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ account }) {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">EnerXchange</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/owner" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Dashboard</Link>
              <Link to="/sell" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Sell Energy</Link>
              <Link to="/buy" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Buy Energy</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <span className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">
              {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;