"use client"

import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const NeonBorderCard = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-600 to-purple-500/30 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
    <div className="relative bg-gray-800 p-6 rounded-lg">
      {children}
    </div>
  </div>
)

const Alert = ({ variant = "success", children }) => (
  <div className={`p-4 rounded-lg flex items-center space-x-2 ${
    variant === "error" ? "bg-red-900/50 text-red-200" : "bg-green-900/50 text-green-200"
  }`}>
    {variant === "error" ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )}
    <span>{children}</span>
  </div>
)

const MetricCard = ({ icon: Icon, title, value, color }) => (
  <NeonBorderCard>
    <div className="flex items-start justify-between">
      <div className={`p-2 rounded-lg ${color}`}>
        {Icon}
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-100">{value}</p>
      </div>
    </div>
  </NeonBorderCard>
)

export default function AdminDashboard({ contract }) {
  const [platformFee, setPlatformFee] = useState('')
  const [feeCollector, setFeeCollector] = useState('')
  const [userToVerify, setUserToVerify] = useState('')
  const [userToInvalidate, setUserToInvalidate] = useState('')
  const [listingToCancel, setListingToCancel] = useState('')
  const [transferFrom, setTransferFrom] = useState({ from: '', to: '', amount: '' })
  const [newOwner, setNewOwner] = useState('')
  const [isPaused, setIsPaused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeListings: 0,
    volumeTraded: 0,
    activeUsers: 0
  })
  const [adminMintData, setAdminMintData] = useState({ recipients: '', amounts: '' })
  const [userProfileAddress, setUserProfileAddress] = useState('')
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    if (contract) {
      fetchPlatformState()
      fetchMetrics()
    }
  }, [contract])

  const fetchPlatformState = async () => {
    try {
      const fee = await contract.platformFee()
      const collector = await contract.feeCollector()
      const paused = await contract.paused()
      setPlatformFee(fee.toString())
      setFeeCollector(collector)
      setIsPaused(paused)
    } catch (err) {
      setError('Failed to fetch platform state')
    }
  }

  const fetchMetrics = async () => {
    try {
      const totalSupply = await contract.totalSupply()
      const listingCount = await contract.nextListingId()
      setMetrics({
        totalUsers: await contract.balanceOf(contract.address),
        activeListings: listingCount.toNumber(),
        volumeTraded: ethers.utils.formatEther(totalSupply),
        activeUsers: 0 // This would require additional logic to determine
      })
    } catch (err) {
      console.error('Error fetching metrics:', err)
    }
  }

  const handleUpdateFee = async () => {
    try {
      setLoading(true)
      const tx = await contract.setPlatformFee(platformFee)
      await tx.wait()
      setSuccess('Platform fee updated successfully')
      fetchPlatformState()
    } catch (err) {
      setError('Failed to update platform fee')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateFeeCollector = async () => {
    try {
      setLoading(true)
      // Note: There's no setFeeCollector function in the ABI. This might need to be implemented in the contract.
      setError('setFeeCollector function not available in the contract')
    } catch (err) {
      setError('Failed to update fee collector')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyUser = async () => {
    try {
      setLoading(true)
      const tx = await contract.verifyUser(userToVerify)
      await tx.wait()
      setSuccess('User verified successfully')
      setUserToVerify('')
    } catch (err) {
      setError('Failed to verify user')
    } finally {
      setLoading(false)
    }
  }

  const handleInvalidateCertification = async () => {
    try {
      setLoading(true)
      const tx = await contract.invalidateCertification(userToInvalidate)
      await tx.wait()
      setSuccess('User certification invalidated successfully')
      setUserToInvalidate('')
    } catch (err) {
      setError('Failed to invalidate user certification')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelListing = async () => {
    try {
      setLoading(true)
      const tx = await contract.cancelListing(listingToCancel)
      await tx.wait()
      setSuccess('Listing cancelled successfully')
      setListingToCancel('')
    } catch (err) {
      setError('Failed to cancel listing')
    } finally {
      setLoading(false)
    }
  }

  const handleTransferFrom = async () => {
    try {
      setLoading(true)
      const tx = await contract.transferFrom(transferFrom.from, transferFrom.to, ethers.utils.parseEther(transferFrom.amount))
      await tx.wait()
      setSuccess('Tokens transferred successfully')
      setTransferFrom({ from: '', to: '', amount: '' })
    } catch (err) {
      setError('Failed to transfer tokens')
    } finally {
      setLoading(false)
    }
  }

  const handleTransferOwnership = async () => {
    try {
      setLoading(true)
      const tx = await contract.transferOwnership(newOwner)
      await tx.wait()
      setSuccess('Ownership transferred successfully')
      setNewOwner('')
    } catch (err) {
      setError('Failed to transfer ownership')
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePause = async () => {
    try {
      setLoading(true)
      const tx = await contract[isPaused ? 'unpause' : 'pause']()
      await tx.wait()
      setIsPaused(!isPaused)
      setSuccess(`Platform ${isPaused ? 'unpaused' : 'paused'} successfully`)
    } catch (err) {
      setError(`Failed to ${isPaused ? 'unpause' : 'pause'} platform`)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminMint = async () => {
    try {
      setLoading(true)
      const recipients = adminMintData.recipients.split(',').map(addr => addr.trim())
      const amounts = adminMintData.amounts.split(',').map(amount => ethers.utils.parseEther(amount.trim()))
      const tx = await contract.adminMint(recipients, amounts)
      await tx.wait()
      setSuccess('Admin mint successful')
      setAdminMintData({ recipients: '', amounts: '' })
    } catch (err) {
      setError('Failed to perform admin mint')
    } finally {
      setLoading(false)
    }
  }

  const handleGetUserProfile = async () => {
    try {
      setLoading(true)
      const profile = await contract.getUserProfile(userProfileAddress)
      setUserProfile({
        isVerified: profile.isVerified,
        totalEnergyTraded: ethers.utils.formatEther(profile.totalEnergyTraded),
        reputationScore: profile.reputationScore.toNumber(),
        lastActivityTime: new Date(profile.lastActivityTime.toNumber() * 1000).toLocaleString(),
        certificationIPFSHash: profile.certificationIPFSHash,
        certificationTimestamp: new Date(profile.certificationTimestamp.toNumber() * 1000).toLocaleString(),
        certificationType: profile.certificationType,
        certificationValid: profile.certificationValid
      })
    } catch (err) {
      setError('Failed to fetch user profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Alerts */}
        {error && <Alert variant="error" className="mb-4">{error}</Alert>}
        {success && <Alert className="mb-4">{success}</Alert>}

        {/* Platform Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            title="Total Users"
            value={metrics.totalUsers.toString()}
            color="bg-blue-500/20 text-blue-500"
          />
          <MetricCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            title="Active Listings"
            value={metrics.activeListings.toString()}
            color="bg-green-500/20 text-green-500"
          />
          <MetricCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="Volume Traded"
            value={`${metrics.volumeTraded} EXT`}
            color="bg-yellow-500/20 text-yellow-500"
          />
          <MetricCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Active Users"
            value={metrics.activeUsers.toString()}
            color="bg-purple-500/20 text-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Fee Settings */}
          <NeonBorderCard>
            <h2 className="text-xl font-bold mb-4">Platform Fee Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Platform Fee (basis points)</label>
                <input
                  type="number"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter fee in basis points (0-1000)"
                />
              </div>
              <button
                onClick={handleUpdateFee}
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Update Platform Fee
              </button>
            </div>
          </NeonBorderCard>

          {/* Fee Collector Settings */}
          <NeonBorderCard>
            <h2 className="text-xl font-bold mb-4">Fee Collector Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Fee Collector Address</label>
                <input
                  type="text"
                  value={feeCollector}
                  onChange={(e) => setFeeCollector(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter ethereum address"
                />
              </div>
              <button
                onClick={handleUpdateFeeCollector}
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Update Fee Collector
              </button>
            </div>
          </NeonBorderCard>

          {/* User Verification */}
          <NeonBorderCard>
            <h2 className="text-xl font-bold mb-4">User Verification</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">User Address</label>
                <input
                  type="text"
                  value={userToVerify}
                  onChange={(e) => setUserToVerify(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter user address to verify"
                />
              </div>
              <button
                onClick={handleVerifyUser}
                disabled={loading}
                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Verify User
              </button>
            </div>
          </NeonBorderCard>

          {/* Invalidate Certification */}
          <NeonBorderCard>
            <h2 className="text-xl font-bold mb-4">Invalidate Certification</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">User Address</label>
                <input
                  type="text"
                  value={userToInvalidate}
                  onChange={(e) => setUserToInvalidate(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter user address to invalidate certification"
                />
              </div>
              <button
                onClick={handleInvalidateCertification}
                disabled={loading}
                className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Invalidate Certification
              </button>
            </div>
          </NeonBorderCard>

          {/* Cancel Listing */}
          <NeonBorderCard>
            <h2 className="text-xl font-bold mb-4">Cancel Listing</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Listing ID</label>
                <input
                  type="number"
                  value={listingToCancel}
                  onChange={(e) => setListingToCancel(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter listing ID to cancel"
                />
              </div>
              <button
                onClick={handleCancelListing}
                disabled={loading}
                className="w-full bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700 disabled:opacity-50 transition-colors"
              >
                Cancel Listing
              </button>
            </div>
          </NeonBorderCard>

          {/* Transfer From */}
          <NeonBorderCard>
            <h2 className="text-xl font-bold mb-4">Transfer From</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">From Address</label>
                <input
                  type="text"
                  value={transferFrom.from}
                  onChange={(e) => setTransferFrom({...transferFrom, from: e.target.value})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter from address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">To Address</label>
                <input
                  type="text"
                  value={transferFrom.to}
                  onChange={(e) => setTransferFrom({...transferFrom, to: e.target.value})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter to address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Amount</label>
                <input
                  type="number"
                  value={transferFrom.amount}
                  onChange={(e) => setTransferFrom({...transferFrom, amount: e.target.value})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount to transfer"
                />
              </div>
              <button
                onClick={handleTransferFrom}
                disabled={loading}
                className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                Transfer From
              </button>
            </div>
          </NeonBorderCard>

          {/* Transfer Ownership */}
          <NeonBorderCard>
            <h2 className="text-xl font-bold mb-4">Transfer Ownership</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">New Owner Address</label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new owner address"
                />
              </div>
              <button
                onClick={handleTransferOwnership}
                disabled={loading}
                className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Transfer Ownership
              </button>
            </div>
          </NeonBorderCard>

          {/* Admin Mint */}
          <NeonBorderCard>
            <h2 className="text-xl font-bold mb-4">Admin Mint</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Recipient Addresses (comma-separated)</label>
                <input
                  type="text"
                  value={adminMintData.recipients}
                  onChange={(e) => setAdminMintData({...adminMintData, recipients: e.target.value})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter recipient addresses"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Amounts (comma-separated)</label>
                <input
                  type="text"
                  value={adminMintData.amounts}
                  onChange={(e) => setAdminMintData({...adminMintData, amounts: e.target.value})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amounts to mint"
                />
              </div>
              <button
                onClick={handleAdminMint}
                disabled={loading}
                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Admin Mint
              </button>
            </div>
          </NeonBorderCard>

          {/* Get User Profile */}
          <NeonBorderCard>
            <h2 className="text-xl font-bold mb-4">Get User Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">User Address</label>
                <input
                  type="text"
                  value={userProfileAddress}
                  onChange={(e) => setUserProfileAddress(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter user address"
                />
              </div>
              <button
                onClick={handleGetUserProfile}
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Get User Profile
              </button>
              {userProfile && (
                <div className="mt-4 p-4 bg-gray-700 rounded">
                  <h3 className="text-lg font-semibold mb-2">User Profile</h3>
                  <p>Verified: {userProfile.isVerified ? 'Yes' : 'No'}</p>
                  <p>Total Energy Traded: {userProfile.totalEnergyTraded} EXT</p>
                  <p>Reputation Score: {userProfile.reputationScore}</p>
                  <p>Last Activity: {userProfile.lastActivityTime}</p>
                  <p>Certification IPFS Hash: {userProfile.certificationIPFSHash}</p>
                  <p>Certification Timestamp: {userProfile.certificationTimestamp}</p>
                  <p>Certification Type: {userProfile.certificationType}</p>
                  <p>Certification Valid: {userProfile.certificationValid ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          </NeonBorderCard>

          {/* Platform Control */}
          <NeonBorderCard className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Platform Control</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Platform Status</h3>
                <p className={`text-sm ${isPaused ? 'text-red-400' : 'text-green-400'}`}>
                  {isPaused ? 'Platform is paused' : 'Platform is active'}
                </p>
              </div>
              <button
                onClick={handleTogglePause}
                disabled={loading}
                className={`flex items-center px-4 py-2 rounded text-white ${
                  isPaused 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50 transition-colors`}
              >
                {isPaused ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    Unpause Platform
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pause Platform
                  </>
                )}
              </button>
            </div>
          </NeonBorderCard>
        </div>
      </div>
    </div>
  )
}