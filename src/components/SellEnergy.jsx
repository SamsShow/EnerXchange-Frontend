import React, { useState } from 'react';
import { ethers } from 'ethers';

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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-6">Sell Energy</div>
        <form onSubmit={handleSell}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount (in tokens)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pricePerUnit">
              Price per Unit (in tokens)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="pricePerUnit"
              type="text"
              placeholder="Price per Unit"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
              Duration (in seconds)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="duration"
              type="text"
              placeholder="Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            List Energy for Sale
          </button>
        </form>
      </div>
    </div>
  );
}

export default SellEnergy;