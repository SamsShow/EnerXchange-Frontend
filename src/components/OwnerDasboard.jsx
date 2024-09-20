import React, { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';

function OwnerDashboard({ contract }) {
  const [listingId, setListingId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [owner, setOwner] = useState('');
  const [spender, setSpender] = useState('');
  const [address, setAddress] = useState('');
  const [details, setDetails] = useState(null);
  const [allowance, setAllowance] = useState('');
  const [balance, setBalance] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [transferOwnershipAddress, setTransferOwnershipAddress] = useState('');

  const handleCancelListing = async () => {
    if (!contract) return;
    try {
      const tx = await contract.cancelListing(listingId);
      await tx.wait();
      alert('Listing canceled successfully!');
    } catch (error) {
      console.error('Error canceling listing:', error);
      alert('Error canceling listing. Check console for details.');
    }
  };

  const handleTransferFrom = async () => {
    if (!contract) return;
    try {
      const tx = await contract.transferFrom(from, to, ethers.utils.parseEther(amount));
      await tx.wait();
      alert('Transfer completed successfully!');
    } catch (error) {
      console.error('Error transferring tokens:', error);
      alert('Error transferring tokens. Check console for details.');
    }
  };

  const handleCheckAllowance = async () => {
    if (!contract) return;
    try {
      const allowed = await contract.allowance(owner, spender);
      setAllowance(ethers.utils.formatEther(allowed));
    } catch (error) {
      console.error('Error fetching allowance:', error);
      alert('Error fetching allowance. Check console for details.');
    }
  };

  const handleCheckBalance = async () => {
    if (!contract) return;
    try {
      const bal = await contract.balanceOf(address);
      setBalance(ethers.utils.formatEther(bal));
    } catch (error) {
      console.error('Error fetching balance:', error);
      alert('Error fetching balance. Check console for details.');
    }
  };

  const handleGetListingDetails = async () => {
    if (!contract) return;
    try {
      const listingDetails = await contract.getListingDetails(listingId);
      setDetails(listingDetails);
    } catch (error) {
      console.error('Error fetching listing details:', error);
      alert('Error fetching listing details. Check console for details.');
    }
  };

  const handleMint = async () => {
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

  const handleTransferOwnership = async () => {
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

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">Owner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mint Energy */}
        <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={fadeIn}>
          <h2 className="text-xl font-bold text-gray-700 mb-4">Mint Energy</h2>
          <div className="flex flex-col space-y-4">
            <input 
              type="text" 
              placeholder="Mint Amount" 
              value={mintAmount} 
              onChange={(e) => setMintAmount(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <input 
              type="text" 
              placeholder="Mint To Address" 
              value={mintAddress} 
              onChange={(e) => setMintAddress(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMint} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Mint Energy
            </motion.button>
          </div>
        </motion.div>

        {/* Transfer Ownership */}
        <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={fadeIn}>
          <h2 className="text-xl font-bold text-gray-700 mb-4">Transfer Ownership</h2>
          <div className="flex flex-col space-y-4">
            <input 
              type="text" 
              placeholder="New Owner Address" 
              value={transferOwnershipAddress} 
              onChange={(e) => setTransferOwnershipAddress(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTransferOwnership} 
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
            >
              Transfer Ownership
            </motion.button>
          </div>
        </motion.div>

        {/* Cancel Listing */}
        <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={fadeIn}>
          <h2 className="text-xl font-bold text-gray-700 mb-4">Cancel Listing</h2>
          <div className="flex flex-col space-y-4">
            <input 
              type="text" 
              placeholder="Listing ID" 
              value={listingId} 
              onChange={(e) => setListingId(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancelListing} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Cancel Listing
            </motion.button>
          </div>
        </motion.div>

        {/* Transfer From */}
        <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={fadeIn}>
          <h2 className="text-xl font-bold text-gray-700 mb-4">Transfer From</h2>
          <div className="flex flex-col space-y-4">
            <input 
              type="text" 
              placeholder="From Address" 
              value={from} 
              onChange={(e) => setFrom(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <input 
              type="text" 
              placeholder="To Address" 
              value={to} 
              onChange={(e) => setTo(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <input 
              type="text" 
              placeholder="Amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTransferFrom} 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
            >
              Transfer
            </motion.button>
          </div>
        </motion.div>

        {/* Check Allowance */}
        <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={fadeIn}>
          <h2 className="text-xl font-bold text-gray-700 mb-4">Check Allowance</h2>
          <div className="flex flex-col space-y-4">
            <input 
              type="text" 
              placeholder="Owner Address" 
              value={owner} 
              onChange={(e) => setOwner(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <input 
              type="text" 
              placeholder="Spender Address" 
              value={spender} 
              onChange={(e) => setSpender(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckAllowance} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Check Allowance
            </motion.button>
            {allowance && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-gray-600"
              >
                Allowance: {allowance} tokens
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Check Balance */}
        <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={fadeIn}>
          <h2 className="text-xl font-bold text-gray-700 mb-4">Check Balance</h2>
          <div className="flex flex-col space-y-4">
            <input 
              type="text" 
              placeholder="Address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckBalance} 
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300"
            >
              Check Balance
            </motion.button>
            {balance && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-gray-600"
              >
                Balance: {balance} tokens
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Get Listing Details */}
        <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={fadeIn}>
          <h2 className="text-xl font-bold text-gray-700 mb-4">Get Listing Details</h2>
          <div className="flex flex-col space-y-4">
            <input 
              type="text" 
              placeholder="Listing ID" 
              value={listingId} 
              onChange={(e) => setListingId(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetListingDetails} 
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition duration-300"
            >
              Get Details
            </motion.button>
            {details && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-gray-600"
              >
                <p>Seller: {details.seller}</p>
                <p>Amount: {ethers.utils.formatEther(details.amount)} tokens</p>
                <p>Price Per Unit: {ethers.utils.formatEther(details.pricePerUnit)} tokens</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default OwnerDashboard;
