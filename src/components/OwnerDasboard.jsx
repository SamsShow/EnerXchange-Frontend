import React, { useState } from 'react';
import { ethers } from 'ethers';

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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-6">Owner Dashboard</div>
        <form onSubmit={handleMint} className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mintAmount">
              Mint Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="mintAmount"
              type="text"
              placeholder="Amount"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mintAddress">
              Mint To Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="mintAddress"
              type="text"
              placeholder="0x..."
              value={mintAddress}
              onChange={(e) => setMintAddress(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Mint Energy
          </button>
        </form>
        <form onSubmit={handleTransferOwnership}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transferOwnershipAddress">
              Transfer Ownership To
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="transferOwnershipAddress"
              type="text"
              placeholder="0x..."
              value={transferOwnershipAddress}
              onChange={(e) => setTransferOwnershipAddress(e.target.value)}
            />
          </div>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Transfer Ownership
          </button>
        </form>
      </div>
    </div>
  );
}

export default OwnerDashboard;