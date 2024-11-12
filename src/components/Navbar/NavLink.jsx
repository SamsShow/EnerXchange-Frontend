import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function NavLink({ to, children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={to}
      className="relative px-4 py-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10 text-gray-300 group-hover:text-white transition-colors duration-300">
        {children}
      </span>
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-full -z-0"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );
}

export default NavLink;