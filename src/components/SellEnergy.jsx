"use client"

import React, { useState, useEffect } from "react"
import { ethers } from "ethers"

const NeonBorderCard = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-600 to-purple-500/30 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
    <div className="relative bg-gray-800 p-6 rounded-lg">
      {children}
    </div>
  </div>
)

const Alert = ({ variant, children }) => (
  <div className={`p-4 rounded-md ${variant === "error" ? "bg-red-900 text-red-200" : "bg-green-900 text-green-200"}`}>
    {children}
  </div>
)

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function SellEnergy({ contract }) {
  const [formData, setFormData] = useState({
    amount: "",
    pricePerUnit: "",
    duration: "",
    minimumPurchase: "",
  })

  const [userListings, setUserListings] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchUserListings()
  }, [contract])

  const fetchUserListings = async () => {
    if (!contract) return
    try {
      const listingCount = await contract.nextListingId()
      const listings = []
      for (let i = 0; i < listingCount; i++) {
        const listing = await contract.energyListings(i)
        if (listing.seller === (await contract.signer.getAddress())) {
          listings.push({ id: i, ...listing })
        }
      }
      setUserListings(listings)
    } catch (error) {
      console.error("Error fetching listings:", error)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePreview = (e) => {
    e.preventDefault()
    setShowPreview(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const tx = await contract.listEnergy(
        ethers.utils.parseEther(formData.amount),
        ethers.utils.parseEther(formData.pricePerUnit),
        ethers.BigNumber.from(formData.duration),
        ethers.utils.parseEther(formData.minimumPurchase)
      )

      setShowConfirmation(true)
      await tx.wait()
      setSuccess("Energy listed successfully!")
      await fetchUserListings()

      setFormData({
        amount: "",
        pricePerUnit: "",
        duration: "",
        minimumPurchase: "",
      })
    } catch (error) {
      setError(error.message || "Error listing energy")
    } finally {
      setLoading(false)
      setShowPreview(false)
    }
  }

  const handleCancelListing = async (listingId) => {
    try {
      const tx = await contract.cancelListing(listingId)
      await tx.wait()
      await fetchUserListings()
      setSuccess("Listing cancelled successfully")
    } catch (error) {
      setError("Error cancelling listing")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <NeonBorderCard>
          <h1 className="text-2xl font-bold text-gray-100 mb-6">
            List Energy for Sale
          </h1>

          {error && <Alert variant="error">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <form onSubmit={handlePreview} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount (tokens)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price per Unit (tokens)
                </label>
                <input
                  type="number"
                  name="pricePerUnit"
                  value={formData.pricePerUnit}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Minimum Purchase (tokens)
                </label>
                <input
                  type="number"
                  name="minimumPurchase"
                  value={formData.minimumPurchase}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-100"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                Preview Listing
              </button>
            </div>
          </form>
        </NeonBorderCard>

        <NeonBorderCard>
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Your Active Listings
          </h2>
          <div className="space-y-4">
            {userListings.map((listing) => (
              <div
                key={listing.id}
                className="border border-gray-700 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-100">
                    Listing #{listing.id}
                  </p>
                  <p className="text-sm text-gray-400">
                    {ethers.utils.formatEther(listing.amount)} tokens at{" "}
                    {ethers.utils.formatEther(listing.pricePerUnit)} tokens/unit
                  </p>
                  <p className="text-sm text-gray-400">
                    Expires:{" "}
                    {new Date(listing.expirationTime.toNumber() * 1000).toLocaleDateString()}
                  </p>
                </div>
                {listing.active && (
                  <button
                    onClick={() => handleCancelListing(listing.id)}
                    className="px-4 py-2 bg-red-900 text-red-100 rounded-lg hover:bg-red-800 transition-colors"
                  >
                    Cancel Listing
                  </button>
                )}
              </div>
            ))}
            {userListings.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No active listings found
              </p>
            )}
          </div>
        </NeonBorderCard>

        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Preview Listing"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-medium text-gray-400">Amount:</div>
              <div className="text-gray-200">{formData.amount} tokens</div>
              <div className="font-medium text-gray-400">Price per Unit:</div>
              <div className="text-gray-200">{formData.pricePerUnit} tokens</div>
              <div className="font-medium text-gray-400">Duration:</div>
              <div className="text-gray-200">{formData.duration} seconds</div>
              <div className="font-medium text-gray-400">Minimum Purchase:</div>
              <div className="text-gray-200">{formData.minimumPurchase} tokens</div>
            </div>
            <div className="pt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Edit
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Confirming..." : "Confirm Listing"}
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          title="Transaction Confirmed"
        >
          <div className="pt-4">
            <p className="text-green-400 mb-4">
              Your energy has been successfully listed on the marketplace!
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}