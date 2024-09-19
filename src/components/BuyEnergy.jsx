import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-6">Buy Energy</div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Available Listings</h3>
          <ul className="space-y-2">
            {listings.map((listing) => (
              <li
                key={listing.id}
                className={`p-2 border rounded cursor-pointer ${
                  selectedListing && selectedListing.id === listing.id ? 'bg-blue-100' : ''
                }`}
                onClick={() => setSelectedListing(listing)}
              >
                Listing #{listing.id}: {ethers.utils.formatEther(listing.amount)} tokens at{' '}
                {ethers.utils.formatEther(listing.pricePerUnit)} tokens per unit
              </li>
            ))}
          </ul>
        </div>
        {selectedListing && (
          <form onSubmit={handlePurchase}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="purchaseAmount">
                Amount to Purchase
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="purchaseAmount"
                type="text"
                placeholder="Amount"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Purchase
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default BuyEnergy;
            