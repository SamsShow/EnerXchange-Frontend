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

export default function CarbonAnalytics({ contract }) {
  const [analyticsData, setAnalyticsData] = useState({
    solarProduction: [],
    tradingVolume: [],
    topProducers: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!contract) return
      try {
        // Fetch solar energy listings for analysis
        const listingCount = await contract.nextListingId()
        const listings = []
        for (let i = 0; i < listingCount; i++) {
          const listing = await contract.energyListings(i)
          listings.push(listing)
        }

        // Process data for charts
        const volumeByDate = processVolumeData(listings)
        const dailyProduction = processSolarProduction(listings)
        const producers = await processTopProducers(listings, contract)

        setAnalyticsData({
          solarProduction: dailyProduction,
          tradingVolume: volumeByDate,
          topProducers: producers
        })
      } catch (error) {
        console.error('Error fetching solar analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [contract])

  const processVolumeData = (listings) => {
    // Sample data - in real implementation, would aggregate from listings
    return [
      { date: '2024-01', volume: 800 },
      { date: '2024-02', volume: 1200 },
      { date: '2024-03', volume: 1000 },
      { date: '2024-04', volume: 1500 }
    ]
  }

  const processSolarProduction = (listings) => {
    // Sample data - in real implementation, would calculate from listings
    return [
      { time: '6AM', production: 0.2 },
      { time: '9AM', production: 1.5 },
      { time: '12PM', production: 2.8 },
      { time: '3PM', production: 2.1 },
      { time: '6PM', production: 0.5 }
    ]
  }

  const processTopProducers = async (listings, contract) => {
    // Sample data - in real implementation, would aggregate from contract events
    return [
      { address: '0x1234...5678', capacity: 15, totalTraded: 1200 },
      { address: '0x5678...9012', capacity: 12, totalTraded: 950 },
      { address: '0x9012...3456', capacity: 10, totalTraded: 800 }
    ]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Solar Energy Trading Analytics</h1>
          <p className="text-gray-400">Monitor your solar energy production and trading performance</p>
        </div>

        {/* Solar Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <NeonBorderCard>
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium">Daily Solar Production</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold">28.5 kWh</div>
              <p className="text-xs text-gray-400">Peak at 12:30 PM</p>
            </div>
          </NeonBorderCard>
          
          <NeonBorderCard>
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium">Trading Volume</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold">1,850 kWh</div>
              <p className="text-xs text-gray-400">Last 30 days</p>
            </div>
          </NeonBorderCard>
          
          <NeonBorderCard>
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium">Battery Storage</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-gray-400">Current capacity</p>
            </div>
          </NeonBorderCard>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <NeonBorderCard>
            <h3 className="text-lg font-semibold mb-4">Daily Solar Production Curve</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.solarProduction}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="production" 
                    stroke="#FCD34D" 
                    strokeWidth={2}
                    name="kWh"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </NeonBorderCard>

          <NeonBorderCard>
            <h3 className="text-lg font-semibold mb-4">Monthly Trading Volume</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.tradingVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Legend />
                  <Bar dataKey="volume" fill="#3B82F6" name="kWh Traded" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </NeonBorderCard>
        </div>

        {/* Top Producers */}
        <NeonBorderCard>
          <h3 className="text-lg font-semibold mb-4">Top Solar Producers</h3>
          <div className="space-y-4">
            {analyticsData.topProducers.map((producer, index) => (
              <div 
                key={producer.address}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-700' : 'bg-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{producer.address}</p>
                    <p className="text-sm text-gray-400">{producer.capacity} kW Capacity</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{producer.totalTraded} kWh</p>
                  <p className="text-sm text-gray-400">Total Energy Traded</p>
                </div>
              </div>
            ))}
          </div>
        </NeonBorderCard>
      </div>
    </div>
  )
}