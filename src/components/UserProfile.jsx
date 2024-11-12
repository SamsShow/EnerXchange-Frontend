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

const Alert = ({ children }) => (
  <div className="p-4 bg-red-900 text-red-200 rounded-md flex items-center space-x-2">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    <span>{children}</span>
  </div>
)

export default function UserProfile({ contract, isAdmin = false }) {
  const [profile, setProfile] = useState(null)
  const [userAddress, setUserAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newCertification, setNewCertification] = useState('')
  const [showAddCert, setShowAddCert] = useState(false)
  const [addingCert, setAddingCert] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const signer = await contract.signer
        const address = await signer.getAddress()
        setUserAddress(address)
        
        const userProfile = await contract.userProfiles(address)
        const certifications = await contract.getUserCertifications(address)
        
        setProfile({
          isVerified: userProfile.isVerified,
          totalEnergyTraded: userProfile.totalEnergyTraded,
          reputationScore: userProfile.reputationScore,
          certifications
        })
        
        setLoading(false)
      } catch (err) {
        setError('Error fetching profile data')
        setLoading(false)
      }
    }

    if (contract) {
      fetchUserProfile()
    }
  }, [contract])

  const handleAddCertification = async () => {
    if (!newCertification) return
    
    try {
      setAddingCert(true)
      const tx = await contract.addUserCertification(userAddress, newCertification)
      await tx.wait()
      
      // Update certifications list
      const updatedCerts = await contract.getUserCertifications(userAddress)
      setProfile(prev => ({
        ...prev,
        certifications: updatedCerts
      }))
      
      setNewCertification('')
      setShowAddCert(false)
    } catch (err) {
      setError('Failed to add certification')
    } finally {
      setAddingCert(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {error && <Alert>{error}</Alert>}
        
        <NeonBorderCard>
          <div className="flex items-center space-x-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="text-2xl font-bold">User Profile</h2>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-400">Wallet Address</span>
              <code className="text-sm bg-gray-700 rounded p-2 font-mono">
                {userAddress}
              </code>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <NeonBorderCard >
                <div className="flex items-center space-x-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-400">Verification Status</span>
                </div>
                <div className="flex items-center space-x-2">
                  {profile.isVerified ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{profile.isVerified ? 'Verified' : 'Unverified'}</span>
                </div>
              </NeonBorderCard>

              <NeonBorderCard >
                <div className="text-sm text-gray-400 mb-2">Total Energy Traded</div>
                <div className="text-2xl font-bold">
                  {ethers.utils.formatEther(profile.totalEnergyTraded)} EXT
                </div>
              </NeonBorderCard>

              <NeonBorderCard>
                <div className="text-sm text-gray-400 mb-2">Reputation Score</div>
                <div className="text-2xl font-bold">
                  {ethers.utils.formatEther(profile.reputationScore)}
                </div>
              </NeonBorderCard>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Certifications</h3>
                {isAdmin && (
                  <button
                    onClick={() => setShowAddCert(!showAddCert)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Certification</span>
                  </button>
                )}
              </div>

              {showAddCert && (
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Enter certification name"
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddCertification}
                    disabled={addingCert || !newCertification}
                    className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600"
                  >
                    {addingCert ? 'Adding...' : 'Add'}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.certifications.map((cert, index) => (
                  <NeonBorderCard key={index}>
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{cert}</span>
                    </div>
                  </NeonBorderCard>
                ))}
                {profile.certifications.length === 0 && (
                  <div className="text-gray-500 col-span-2 text-center py-4">
                    No certifications yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </NeonBorderCard>
      </div>
    </div>
  )
}