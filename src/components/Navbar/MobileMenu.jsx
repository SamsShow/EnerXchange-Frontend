import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function MobileMenu({ isOpen, setIsOpen }) {
  const menuItems = ['Marketplace', 'Sell Energy', 'Profile', 'Carbon Credits', 'Transactions', 'Help'];

  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 'auto' : 0 }}
      transition={{ duration: 0.3 }}
      className="md:hidden overflow-hidden"
    >
      <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/90">
        {menuItems.map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase().replace(' ', '-')}`}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            {item}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default MobileMenu;