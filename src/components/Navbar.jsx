import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import NavLink from '../components/Navbar/NavLink';
import WalletButton from '../components/Navbar/WalletButton';
import MobileMenu from '../components/Navbar/MobileMenu';

function Navbar({ account }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/marketplace", label: "Marketplace" },
    { to: "/sell-energy", label: "Sell Energy" },
    { to: "/user-profile", label: "Profile" },
    { to: "/carbon-analytics", label: "Carbon Credits" },
    { to: "/transactions", label: "Transactions" },
    { to: "/help", label: "Help" }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-green-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                EnerXchange
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ to, label }) => (
              <NavLink key={to} to={to}>{label}</NavLink>
            ))}
          </div>

          <WalletButton account={account} />

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </motion.nav>
  );
}

export default Navbar;