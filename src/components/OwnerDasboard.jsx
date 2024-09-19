import React, { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';

function OwnerDashboard({ contract }) {
  const [mintAmount, setMintAmount] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [transferOwnershipAddress, setTransferOwnershipAddress] = useState('');

  const handleMint = async (e) => {
    e.preventDefault();
    if (!contract) return;
    try {
      const tx = await contract.mintEnergy(mintAddress, ethers.utils.parseEther(mintAmount));
      await tx.wait();
      alert('Energy minted successfully!');
    } catch (error) {
      console.error('Error minting energy:', error);
      alert('Error minting energy. Check console for details.');
    }
  };

  const handleTransferOwnership = async (e) => {
    e.preventDefault();
    if (!contract) return;
    try {
      const tx = await contract.transferOwnership(transferOwnershipAddress);
      await tx.wait();
      alert('Ownership transfer initiated. New owner must accept the transfer.');
    } catch (error) {
      console.error('Error transferring ownership:', error);
      alert('Error transferring ownership. Check console for details.');
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
          Owner Dashboard
        </motion.h1>

        {/* Mint Energy Form */}
        <motion.form 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleMint} 
          className="mb-8 space-y-6"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="mintAmount">
              Mint Amount
            </label>
            <input
              className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out duration-300"
              id="mintAmount"
              type="text"
              placeholder="Enter amount"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="mintAddress">
              Mint To Address
            </label>
            <input
              className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out duration-300"
              id="mintAddress"
              type="text"
              placeholder="0x..."
              value={mintAddress}
              onChange={(e) => setMintAddress(e.target.value)}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md shadow-lg transition ease-in-out duration-300"
            type="submit"
          >
            Mint Energy
          </motion.button>
        </motion.form>

        {/* Transfer Ownership Form */}
        <motion.form 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleTransferOwnership} 
          className="space-y-6"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="transferOwnershipAddress">
              Transfer Ownership To
            </label>
            <input
              className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition ease-in-out duration-300"
              id="transferOwnershipAddress"
              type="text"
              placeholder="0x..."
              value={transferOwnershipAddress}
              onChange={(e) => setTransferOwnershipAddress(e.target.value)}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md shadow-lg transition ease-in-out duration-300"
            type="submit"
          >
            Transfer Ownership
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default OwnerDashboard;
