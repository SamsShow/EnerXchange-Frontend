import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import MarketStats from './MarketStats';
import FeaturedListings from './FeaturedListing';
import ConnectWallet from './ConnectWallet';

function HeroSection({ account }) {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-900 via-[#0c0c1d] to-black overflow-hidden pt-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl -top-48 -left-24 animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl top-96 -right-24 animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Zap className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Welcome to EnerXchange
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            The future of peer-to-peer energy trading. Connect your wallet to start trading renewable energy on the blockchain.
          </p>
        </motion.div>

        <ConnectWallet account={account} />
        <MarketStats />
        <FeaturedListings />
      </div>
    </section>
  );
}

export default HeroSection;