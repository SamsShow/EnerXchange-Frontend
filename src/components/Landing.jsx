import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from "../assets/enerxchange.png"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function LandingPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial="initial"
        animate="animate"
        variants={staggerChildren}
        className="py-20 px-4 text-center relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <img className='px-[450px] py-5' src={logo} alt="logo" />
          <motion.h1 variants={fadeIn} className="text-7xl font-bold mb-4">EnerXchange</motion.h1>
          <motion.p variants={fadeIn} className="text-xl mb-8">Revolutionizing peer-to-peer energy trading with blockchain technology</motion.p>
          <motion.div variants={fadeIn} className="flex justify-center space-x-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Buy Energy
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border border-white text-white px-4 py-2 rounded"
            >
              Sell Energy
            </motion.button>
          </motion.div>
          <motion.div variants={staggerChildren} className="grid grid-cols-3 gap-4 transition-all">
            <div className="overflow-hidden rounded">
              <img
                src="https://images.unsplash.com/photo-1639843906796-a2c47fc24330?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Blockchain"
                className="w-full h-[480px] transition-transform duration-300 ease-in-out transform hover:scale-110"
              />
            </div>
            <div className="overflow-hidden rounded">
              <img
                src="https://plus.unsplash.com/premium_photo-1679917152562-09bb29e555c1?q=80&w=1527&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Solar Panels"
                className="w-full h-[480px] transition-transform duration-300 ease-in-out transform hover:scale-110"
              />
            </div>
            <div className="overflow-hidden rounded">
              <img
                src="https://plus.unsplash.com/premium_photo-1679607686280-53c9473f5a80?q=80&w=1430&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Smart Grid"
                className="w-full h-[480px] transition-transform duration-300 ease-in-out transform hover:scale-110"
              />
            </div>
          </motion.div>


        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="py-16 bg-gray-900"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 variants={fadeIn} className="text-4xl font-bold mb-8">HOW EnerXchange WORKS</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={fadeIn}>
              <img src="https://plus.unsplash.com/premium_photo-1682309671884-6b4cc375b376?q=80&w=1512&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="P2P Energy Trading Process" className="w-full rounded-lg" />
            </motion.div>
            <motion.div variants={staggerChildren}>
              <motion.h3 variants={fadeIn} className="text-2xl font-bold mb-4">Decentralized Energy Marketplace</motion.h3>
              <motion.ul variants={staggerChildren} className="list-disc pl-5">
                <motion.li variants={fadeIn}>Connect your renewable energy source to our smart grid</motion.li>
                <motion.li variants={fadeIn}>Set your energy price and trading preferences</motion.li>
                <motion.li variants={fadeIn}>Our blockchain ensures secure and transparent transactions</motion.li>
                <motion.li variants={fadeIn}>Buyers can purchase locally produced renewable energy</motion.li>
                <motion.li variants={fadeIn}>Smart contracts automate payments and energy distribution</motion.li>
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Key Features Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="py-16 bg-black"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 variants={fadeIn} className="text-4xl font-bold mb-8">KEY FEATURES OF EnerXchange</motion.h2>
          <motion.div variants={staggerChildren} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              'Blockchain Security',
              'Smart Contracts',
              'Real-time Trading',
              'Energy Tracking',
              'Flexible Pricing',
              'Community Building'
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                {/* <img src={`/api/placeholder/100/100`} alt={feature} className="w-16 h-16 mb-4" /> */}
                <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                <p className="text-gray-400">How {feature.toLowerCase()} enhances your energy trading experience.</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="py-16 bg-gray-900"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 variants={fadeIn} className="text-4xl font-bold mb-8">BENEFITS OF USING EnerXchange</motion.h2>
          <motion.div variants={staggerChildren} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              'Lower Energy Costs',
              'Support Local Renewables',
              'Reduce Carbon Footprint',
              'Earn from Excess Energy',
              'Increase Grid Resilience',
              'Transparent Transactions'
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="bg-gray-800 rounded-lg overflow-hidden"
              >
                <img src={`https://plus.unsplash.com/premium_photo-1674506654010-22677db35bdf?q=80&w=1460&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} alt={benefit} className="w-full h-48 object-cover" />

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{benefit}</h3>
                  <p className="text-sm text-gray-400">How {benefit.toLowerCase()} impacts you and your community.</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="py-20 bg-gradient-to-r from-blue-600 to-zinc-900 text-center"
      >
        <motion.h2 variants={fadeIn} className="text-4xl font-bold mb-4">JOIN THE ENERGY REVOLUTION</motion.h2>
        <motion.p variants={fadeIn} className="text-xl mb-8">Start trading renewable energy on the blockchain today</motion.p>
        <motion.button
          variants={fadeIn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-gray-200 transition duration-300"
        >
          Get Started
        </motion.button>
      </motion.section>
    </div>
  );
}

export default LandingPage;