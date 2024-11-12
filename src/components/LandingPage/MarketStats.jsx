import { motion } from 'framer-motion';
import { Activity, Battery, Wallet, Users } from 'lucide-react';

const stats = [
  {
    icon: Battery,
    label: 'Total Energy Listed',
    value: '245.8 MWh',
    change: '+12.3%',
    positive: true
  },
  {
    icon: Activity,
    label: 'Trading Volume',
    value: '1,234 MWh',
    change: '+8.1%',
    positive: true
  },
  {
    icon: Wallet,
    label: 'Average Price',
    value: '0.12 ETH',
    change: '-2.4%',
    positive: false
  },
  {
    icon: Users,
    label: 'Active Traders',
    value: '2,156',
    change: '+15.7%',
    positive: true
  }
];

function MarketStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <stat.icon className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm text-gray-400">{stat.label}</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-white">{stat.value}</span>
            <span className={`text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
              {stat.change}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default MarketStats;