import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

function ConnectWallet({ account }) {
  return (
    <div className="flex flex-col items-center gap-4 mb-16">
      {!account ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
        >
          <div className="absolute inset-0 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative flex items-center gap-2 text-white font-semibold">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </span>
        </motion.button>
      ) : (
        <div className="flex items-center gap-3 px-6 py-3 bg-gray-800/50 rounded-full border border-gray-700">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-300">Connected: {`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
        </div>
      )}
    </div>
  );
}

export default ConnectWallet;