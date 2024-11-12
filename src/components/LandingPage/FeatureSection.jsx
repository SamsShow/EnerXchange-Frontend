import { motion } from 'framer-motion';
import { Shield, Cpu, Zap, BarChart2, Users, Lock } from 'lucide-react';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: Shield,
    title: 'Blockchain Security',
    description: 'Advanced cryptographic security ensures your energy trades are protected.'
  },
  {
    icon: Cpu,
    title: 'Smart Contracts',
    description: 'Automated, trustless transactions powered by blockchain technology.'
  },
  {
    icon: Zap,
    title: 'Real-time Trading',
    description: 'Trade energy instantly with zero intermediaries.'
  },
  {
    icon: BarChart2,
    title: 'Energy Tracking',
    description: 'Monitor your energy production and consumption in real-time.'
  },
  {
    icon: Users,
    title: 'Community Building',
    description: 'Connect with local energy producers and consumers.'
  },
  {
    icon: Lock,
    title: 'Flexible Pricing',
    description: 'Set your own prices and trading preferences.'
  }
];

function FeaturesSection() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl -top-96 -right-96" />
        <div className="absolute w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl bottom-0 -left-48" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Key Features
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the next generation of energy trading with our cutting-edge features
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesSection;