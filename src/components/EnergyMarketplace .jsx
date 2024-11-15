"use client"

import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const NeonBorderCard = ({ children, onClick }) => (
  <div className="relative group" onClick={onClick}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
    <div className="relative bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer">
      {children}
    </div>
  </div>
)

const formatLargeNumber = (num) => {
  return parseFloat(ethers.utils.formatEther(num)).toLocaleString(undefined, {maximumFractionDigits: 4})
}

export default function EnergyMarketplace({ contract }) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedListing, setSelectedListing] = useState(null)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minPurchase: ''
  })
  const [isFiltersApplied, setIsFiltersApplied] = useState(false)
  const [purchaseAmount, setPurchaseAmount] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [userBalance, setUserBalance] = useState('0')

  useEffect(() => {
    const fetchListings = async () => {
      if (!contract) return
      try {
        setLoading(true)
        const listingCount = await contract.nextListingId()
        const fetchedListings = []
        for (let i = 0; i < listingCount; i++) {
          const listing = await contract.energyListings(i)
          if (listing.active) {
            fetchedListings.push({
              id: i,
              ...listing
            })
          }
        }
        setListings(fetchedListings)
      } catch (error) {
        console.error('Error fetching listings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [contract])

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (contract && contract.signer) {
        try {
          const address = await contract.signer.getAddress()
          const balance = await contract.balanceOf(address)
          setUserBalance(balance.toString())
        } catch (error) {
          console.error('Error fetching user balance:', error)
        }
      }
    }
    fetchUserBalance()
  }, [contract])

  const getFilteredListings = () => {
    if (!isFiltersApplied) return listings

    return listings.filter(listing => {
      const priceInEth = parseFloat(ethers.utils.formatEther(listing.pricePerUnit))
      const minPrice = filters.minPrice === '' ? 0 : parseFloat(filters.minPrice)
      const maxPrice = filters.maxPrice === '' ? Infinity : parseFloat(filters.maxPrice)
      const minPurchase = filters.minPurchase === '' ? 0 : parseFloat(filters.minPurchase)

      return (
        priceInEth >= minPrice &&
        priceInEth <= maxPrice &&
        parseFloat(ethers.utils.formatEther(listing.minimumPurchase)) >= minPurchase
      )
    })
  }

  const handleApplyFilters = () => {
    setIsFiltersApplied(true)
  }

  const handleResetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minPurchase: ''
    })
    setIsFiltersApplied(false)
  }

  const handlePurchase = async () => {
    if (!selectedListing || !purchaseAmount) return

    try {
      setLoading(true)
      // Check if the user has sufficient balance
      const balance = await contract.balanceOf(await contract.signer.getAddress())
      const totalCost = ethers.BigNumber.from(selectedListing.pricePerUnit).mul(ethers.utils.parseEther(purchaseAmount))
      
      if (balance.lt(totalCost)) {
        throw new Error("Insufficient balance to make this purchase.")
      }

      // Check if the purchase amount is within the allowed range
      const minPurchase = ethers.utils.formatEther(selectedListing.minimumPurchase)
      const maxPurchase = ethers.utils.formatEther(selectedListing.amount)
      
      if (parseFloat(purchaseAmount) < parseFloat(minPurchase) || parseFloat(purchaseAmount) > parseFloat(maxPurchase)) {
        throw new Error(`Purchase amount must be between ${minPurchase} and ${maxPurchase} units.`)
      }

      // Attempt to purchase energy
      const tx = await contract.purchaseEnergy(
        selectedListing.id,
        ethers.utils.parseEther(purchaseAmount)
      )
      await tx.wait()
      alert('Energy purchased successfully!')
      setIsSheetOpen(false)
      // Refetch listings
      fetchListings()
    } catch (error) {
      console.error('Error purchasing energy:', error)
      if (error.message.includes("execution reverted")) {
        alert('Transaction failed. Please check your balance and the listing details.')
      } else {
        alert(error.message || 'Error purchasing energy. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = getFilteredListings()

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-4">Energy Marketplace</h1>
          <p className="text-gray-400">Browse and purchase energy from verified sellers</p>
        </div>

        <div className="mb-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Price Range (ETH)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100"
                  placeholder="Min"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100"
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Minimum Purchase</label>
              <input
                type="number"
                value={filters.minPurchase}
                onChange={(e) => setFilters({...filters, minPurchase: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100"
                placeholder="Enter minimum units"
              />
            </div>

            <div className="flex items-end space-x-4">
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-gray-400">Loading listings...</span>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-yellow-900 border border-yellow-800 text-yellow-200 px-4 py-3 rounded-md">
            <p>No energy listings found {isFiltersApplied ? 'matching your criteria. Try adjusting your filters.' : '.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <NeonBorderCard
                key={listing.id}
                onClick={() => {
                  setSelectedListing(listing)
                  setIsSheetOpen(true)
                }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-100">Energy Listing</h3>
                        <p className="text-sm text-gray-400">ID: #{listing.id}</p>
                      </div>
                    </div>
                    <div className="bg-blue-900 px-3 py-1 rounded-full">
                      <span className="text-blue-200 font-medium">
                        {ethers.utils.formatEther(listing.pricePerUnit)} ETH
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Available Supply</span>
                      <span className="font-medium text-gray-200">{ethers.utils.formatEther(listing.amount)} units</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Minimum Purchase</span>
                      <span className="font-medium text-gray-200">{ethers.utils.formatEther(listing.minimumPurchase)} units</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Expires</span>
                      <span className="font-medium text-gray-200">
                        {new Date(listing.expirationTime.toNumber() * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </NeonBorderCard>
            ))}
          </div>
        )}

        {isSheetOpen && selectedListing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="w-full max-w-md bg-gray-800 h-full overflow-y-auto p-6">
              <button
                onClick={() => setIsSheetOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-gray-100 mb-6">Purchase Energy</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">Energy Listing</h3>
                    <p className="text-sm text-gray-400">Listing #{selectedListing.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 mb-1">Seller Address</label>
                    <p className="font-mono text-sm bg-gray-700 p-2 rounded text-gray-200">{selectedListing.seller}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Available Amount</label>
                    <p className="font-medium text-gray-200">{formatLargeNumber(selectedListing.amount)} units</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Minimum Purchase</label>
                    <p className="font-medium text-gray-200">{formatLargeNumber(selectedListing.minimumPurchase)} units</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Your Balance</label>
                    <p className="font-medium text-gray-200">{formatLargeNumber(userBalance)} EXT</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Purchase Amount (units)</label>
                    <input
                      type="number"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      min={ethers.utils.formatEther(selectedListing.minimumPurchase)}
                      max={ethers.utils.formatEther(selectedListing.amount)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100"
                      placeholder={`Min: ${ethers.utils.formatEther(selectedListing.minimumPurchase)} units`}
                    />
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Price per unit</span>
                      <span className="font-medium text-gray-100">
                        {ethers.utils.formatEther(selectedListing.pricePerUnit)} ETH
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-lg font-medium">
                      <span className="text-gray-300">Total Cost</span>
                      <span className="text-blue-400">
                        {purchaseAmount ? 
                          (parseFloat(purchaseAmount) * parseFloat(ethers.utils.formatEther(selectedListing.pricePerUnit))).toFixed(4) : 
                          '0'} ETH
                      </span>
                    </div>
                  </div>

                  <button 
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    disabled={!purchaseAmount || loading}
                    onClick={handlePurchase}
                  >
                    {loading ? 'Processing...' : (purchaseAmount ? `Purchase ${purchaseAmount} units` : 'Enter purchase amount')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}