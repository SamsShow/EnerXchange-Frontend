import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

const listings = [
  {
    id: 1,
    title: 'Solar Energy Package',
    provider: 'SolarTech Solutions',
    amount: '50 kWh',
    price: '0.05 ETH',
    type: 'Solar',
    rating: 4.8
  },
  {
    id: 2,
    title: 'Wind Energy Bundle',
    provider: 'WindPower Co.',
    amount: '100 kWh',
    price: '0.08 ETH',
    type: 'Wind',
    rating: 4.9
  },
  {
    id: 3,
    title: 'Hydro Energy Pack',
    provider: 'HydroGen Inc.',
    amount: '75 kWh',
    price: '0.06 ETH',
    type: 'Hydro',
    rating: 4.7
  }
];

function FeaturedListings() {
  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Featured Listings</h3>
        <motion.button
          whileHover={{ x: 5 }}
          className="flex items-center gap-2 text-green-400 hover:text-green-300"
        >
          View All <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">{listing.title}</h4>
                  <p className="text-sm text-gray-400">{listing.provider}</p>
                </div>
                <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">{listing.amount}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">{listing.price}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium hover:bg-green-500/30 transition-colors"
                >
                  Trade Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedListings;