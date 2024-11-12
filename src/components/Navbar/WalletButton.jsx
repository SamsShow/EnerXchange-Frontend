import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function WalletButton({ account }) {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700 text-gray-300 text-sm"
      >
        {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <Link
          to="/wallet"
          className="relative px-4 py-2 bg-gray-900 rounded-full text-gray-300 hover:text-white transition-colors duration-300"
        >
          Info
        </Link>
      </motion.div>
    </div>
  );
}

export default WalletButton;