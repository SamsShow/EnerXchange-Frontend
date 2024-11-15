"use client"

import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const NeonBorderCard = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-600 to-purple-500/30 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
    <div className="relative bg-gray-800 p-6 rounded-lg">
      {children}
    </div>
  </div>
)

const safeBigNumberToNumber = (bigNumber) => {
  try {
    // First convert to string to handle large numbers safely
    const stringValue = ethers.utils.formatEther(bigNumber)
    // Then parse to float for numerical operations
    return parseFloat(stringValue)
  } catch (error) {
    console.error('Error converting BigNumber:', error)
    return 0
  }
}

export default function CarbonAnalytics({ contract }) {
  const [analyticsData, setAnalyticsData] = useState({
    solarProduction: [],
    tradingVolume: [],
    topProducers: [],
    userProfiles: [],
    listingsData: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!contract) return
      try {
        const listingCount = await contract.nextListingId()
        const listings = []
        const userProfilesMap = new Map()

        for (let i = 0; i < listingCount; i++) {
          const listing = await contract.energyListings(i)
          listings.push({
            id: i,
            seller: listing.seller,
            amount: ethers.utils.formatEther(listing.amount),
            pricePerUnit: ethers.utils.formatEther(listing.pricePerUnit),
            expirationTime: new Date(listing.expirationTime * 1000).toLocaleString(),
            active: listing.active,
            minimumPurchase: ethers.utils.formatEther(listing.minimumPurchase),
            creationTime: new Date(listing.creationTime * 1000).toLocaleString()
          })

          if (!userProfilesMap.has(listing.seller)) {
            const profile = await contract.getUserProfile(listing.seller)
            userProfilesMap.set(listing.seller, {
              address: listing.seller,
              isVerified: profile.isVerified,
              totalEnergyTraded: ethers.utils.formatEther(profile.totalEnergyTraded),
              reputationScore: safeBigNumberToNumber(profile.reputationScore),
              lastActivityTime: new Date(profile.lastActivityTime * 1000).toLocaleString(),
              certificationValid: profile.certificationValid
            })
          }
        }

        const userProfiles = Array.from(userProfilesMap.values())

        const volumeByDate = processVolumeData(listings)
        const dailyProduction = processSolarProduction(listings)
        const topProducers = processTopProducers(userProfiles)

        setAnalyticsData({
          solarProduction: dailyProduction,
          tradingVolume: volumeByDate,
          topProducers: topProducers,
          userProfiles: userProfiles,
          listingsData: listings
        })
        setError(null)
      } catch (error) {
        console.error('Error fetching solar analytics:', error)
        setError('Failed to fetch analytics data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [contract])

  const processVolumeData = (listings) => {
    const volumeByDate = {}
    listings.forEach(listing => {
      const date = new Date(listing.creationTime).toISOString().split('T')[0]
      volumeByDate[date] = (volumeByDate[date] || 0) + parseFloat(listing.amount)
    })
    return Object.entries(volumeByDate).map(([date, volume]) => ({ date, volume }))
  }

  const processSolarProduction = (listings) => {
    const productionByHour = {}
    listings.forEach(listing => {
      const hour = new Date(listing.creationTime).getHours()
      productionByHour[hour] = (productionByHour[hour] || 0) + parseFloat(listing.amount)
    })
    return Object.entries(productionByHour).map(([hour, production]) => ({ time: `${hour}:00`, production }))
  }

  const processTopProducers = (userProfiles) => {
    return userProfiles
      .sort((a, b) => parseFloat(b.totalEnergyTraded) - parseFloat(a.totalEnergyTraded))
      .slice(0, 5)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Solar Energy Trading Analytics</h1>
          <p className="text-gray-400">Monitor your solar energy production and trading performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <NeonBorderCard>
            <h3 className="text-sm font-medium mb-2">Total Energy Traded</h3>
            <div className="text-2xl font-bold">
              {analyticsData.userProfiles.reduce((sum, profile) => sum + parseFloat(profile.totalEnergyTraded), 0).toFixed(2)} kWh
            </div>
          </NeonBorderCard>
          
          <NeonBorderCard>
            <h3 className="text-sm font-medium mb-2">Active Listings</h3>
            <div className="text-2xl font-bold">
              {analyticsData.listingsData.filter(listing => listing.active).length}
            </div>
          </NeonBorderCard>
          
          <NeonBorderCard>
            <h3 className="text-sm font-medium mb-2">Verified Users</h3>
            <div className="text-2xl font-bold">
              {analyticsData.userProfiles.filter(profile => profile.isVerified).length}
            </div>
          </NeonBorderCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <NeonBorderCard>
            <h3 className="text-lg font-semibold mb-4">Daily Solar Production Curve</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.solarProduction}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                  <Legend />
                  <Line type="monotone" dataKey="production" stroke="#FCD34D" strokeWidth={2} name="kWh" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </NeonBorderCard>

          <NeonBorderCard>
            <h3 className="text-lg font-semibold mb-4">Trading Volume</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.tradingVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                  <Legend />
                  <Bar dataKey="volume" fill="#3B82F6" name="kWh Traded" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </NeonBorderCard>
        </div>

        <NeonBorderCard>
          <h3 className="text-lg font-semibold mb-4">Top Solar Producers</h3>
          <div className="space-y-4">
            {analyticsData.topProducers.map((producer, index) => (
              <div key={producer.address} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-700' : 'bg-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{`${producer.address.slice(0, 6)}...${producer.address.slice(-4)}`}</p>
                    <p className="text-sm text-gray-400">Reputation Score: {producer.reputationScore}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{parseFloat(producer.totalEnergyTraded).toFixed(2)} kWh</p>
                  <p className="text-sm text-gray-400">
                    {producer.isVerified ? 'Verified' : 'Unverified'}
                    {producer.certificationValid ? ' | Certified' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </NeonBorderCard>
      </div>
    </div>
  )
}