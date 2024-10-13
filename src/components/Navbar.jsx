import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar({ account }) {
  const links = [
    { to: '/owner', label: 'Dashboard' },
    { to: '/sell', label: 'Sell Energy' },
    { to: '/buy', label: 'Buy Energy' }
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center py-4 px-2 font-semibold text-green-500 text-lg"
                    : "flex items-center py-4 px-2 font-semibold text-gray-500 text-lg"
                }
              >
                EnerXchange
              </NavLink>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    isActive
                      ? "py-4 px-2 text-green-500 transition duration-300"
                      : "py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300"
                  }
                >
                  {link.label}
                </NavLink>
              ))}
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
