import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';

function BuyEnergy({ contract }) {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      if (!contract) return;
      try {
        const listingCount = await contract.nextListingId();
        const fetchedListings = [];
        for (let i = 0; i < listingCount; i++) {
          const listing = await contract.getListingDetails(i);
          if (listing.active) {
            fetchedListings.push({ id: i, ...listing });
          }
        }
        setListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, [contract]);

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!contract || !selectedListing) return;
    try {
      const tx = await contract.purchaseEnergy(
        selectedListing.id,
        ethers.utils.parseEther(purchaseAmount)
      );
      await tx.wait();
      alert('Energy purchased successfully!');
    } catch (error) {
      console.error('Error purchasing energy:', error);
      alert('Error purchasing energy. Check console for details.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-8">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="uppercase tracking-widest text-lg text-indigo-600 font-semibold mb-8"
        >
          Buy Energy
        </motion.h1>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Available Listings</h3>
          <ul className="space-y-3">
            {listings.map((listing) => (
              <motion.li
                whileHover={{ scale: 1.03 }}
                key={listing.id}
                className={`p-3 border border-gray-200 rounded-md shadow-sm transition duration-300 ease-in-out cursor-pointer ${
                  selectedListing && selectedListing.id === listing.id ? 'bg-blue-100 border-blue-300' : 'bg-white'
                }`}
                onClick={() => setSelectedListing(listing)}
              >
                <span className="font-medium">Listing #{listing.id}:</span> {ethers.utils.formatEther(listing.amount)} tokens at {ethers.utils.formatEther(listing.pricePerUnit)} tokens per unit
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {selectedListing && (
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            onSubmit={handlePurchase}
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="purchaseAmount">
                Amount to Purchase
              </label>
              <input
                className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out duration-300"
                id="purchaseAmount"
                type="text"
                placeholder="Enter amount"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
              />
            </div>
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md shadow-lg transition ease-in-out duration-300"
                type="submit"
              >
                Purchase
              </motion.button>
            </div>
          </motion.form>
        )}
      </div>
    </motion.div>
  );
}

export default BuyEnergy;
