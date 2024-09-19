import React, { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';

function SellEnergy({ contract }) {
  const [amount, setAmount] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [duration, setDuration] = useState('');

  const handleSell = async (e) => {
    e.preventDefault();
    if (!contract) return;
    try {
      const tx = await contract.listEnergy(
        ethers.utils.parseEther(amount),
        ethers.utils.parseEther(pricePerUnit),
        ethers.BigNumber.from(duration)
      );
      await tx.wait();
      alert('Energy listed successfully!');
    } catch (error) {
      console.error('Error listing energy:', error);
      alert('Error listing energy. Check console for details.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="p-10">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="uppercase tracking-widest text-lg text-indigo-600 font-semibold mb-8"
        >
          Sell Energy
        </motion.h1>

        <motion.form 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSell}
          className="space-y-6"
        >
          {/* Amount Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="amount">
              Amount (in tokens)
            </label>
            <input
              className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out duration-300"
              id="amount"
              type="text"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Price Per Unit Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="pricePerUnit">
              Price per Unit (in tokens)
            </label>
            <input
              className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out duration-300"
              id="pricePerUnit"
              type="text"
              placeholder="Enter price per unit"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
            />
          </div>

          {/* Duration Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="duration">
              Duration (in seconds)
            </label>
            <input
              className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out duration-300"
              id="duration"
              type="text"
              placeholder="Enter duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md shadow-lg transition ease-in-out duration-300"
            type="submit"
          >
            List Energy for Sale
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default SellEnergy;
