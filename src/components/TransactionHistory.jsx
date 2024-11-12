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

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString()
}

export default function TransactionHistory({ contract }) {
  const [transactions, setTransactions] = useState([])
  const [filters, setFilters] = useState({
    type: 'all',
    source: 'all',
    startDate: '',
    endDate: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchTransactionHistory()
  }, [contract])

  const fetchTransactionHistory = async () => {
    if (!contract) return

    try {
      const address = await contract.signer.getAddress()
      
      const purchaseFilter = contract.filters.EnergyPurchased(null, address)
      const saleFilter = contract.filters.EnergyListed(null, address)
      
      const purchaseEvents = await contract.queryFilter(purchaseFilter)
      const saleEvents = await contract.queryFilter(saleFilter)
      
      const formattedPurchases = await Promise.all(purchaseEvents.map(async (event) => {
        const listing = await contract.energyListings(event.args.listingId)
        return {
          type: 'purchase',
          id: event.args.listingId.toString(),
          amount: ethers.utils.formatEther(event.args.amount),
          price: ethers.utils.formatEther(event.args.totalPrice),
          date: (await event.getBlock()).timestamp,
          source: listing.energySource
        }
      }))

      const formattedSales = await Promise.all(saleEvents.map(async (event) => {
        return {
          type: 'sale',
          id: event.args.listingId.toString(),
          amount: ethers.utils.formatEther(event.args.amount),
          price: ethers.utils.formatEther(event.args.pricePerUnit),
          date: (await event.getBlock()).timestamp,
          source: (await contract.energyListings(event.args.listingId)).energySource
        }
      }))

      setTransactions([...formattedPurchases, ...formattedSales])
    } catch (error) {
      console.error('Error fetching transaction history:', error)
    }
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filters.type === 'all' || tx.type === filters.type
    const matchesSource = filters.source === 'all' || tx.source === filters.source
    const matchesDateRange = (!filters.startDate || tx.date >= new Date(filters.startDate).getTime() / 1000) &&
                           (!filters.endDate || tx.date <= new Date(filters.endDate).getTime() / 1000)
    return matchesType && matchesSource && matchesDateRange
  })

  const exportHistory = () => {
    const csv = [
      ['Type', 'ID', 'Amount', 'Price', 'Date', 'Source'],
      ...filteredTransactions.map(tx => [
        tx.type,
        tx.id,
        tx.amount,
        tx.price,
        formatDate(tx.date),
        tx.source
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transaction-history.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20">
      <div className="max-w-6xl mx-auto p-6">
        <NeonBorderCard>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4">
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 text-sm bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filters
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ml-1 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={exportHistory}
                className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-700 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.type}
                onChange={e => setFilters({...filters, type: e.target.value})}
                className="p-2 bg-gray-600 border border-gray-500 rounded-md text-gray-100"
              >
                <option value="all">All Types</option>
                <option value="purchase">Purchases</option>
                <option value="sale">Sales</option>
              </select>
              <select
                value={filters.source}
                onChange={e => setFilters({...filters, source: e.target.value})}
                className="p-2 bg-gray-600 border border-gray-500 rounded-md text-gray-100"
              >
                <option value="all">All Sources</option>
                <option value="solar">Solar</option>
              </select>
              <input
                type="date"
                value={filters.startDate}
                onChange={e => setFilters({...filters, startDate: e.target.value})}
                className="p-2 bg-gray-600 border border-gray-500 rounded-md text-gray-100"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={e => setFilters({...filters, endDate: e.target.value})}
                className="p-2 bg-gray-600 border border-gray-500 rounded-md text-gray-100"
                placeholder="End Date"
              />
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Amount (Tokens)</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, index) => (
                  <tr 
                    key={`${tx.id}-${tx.type}-${index}`}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        tx.type === 'purchase' ? 'bg-green-900 text-green-200' : 'bg-blue-900 text-blue-200'
                      }`}>
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{tx.id}</td>
                    <td className="py-3 px-4">{tx.amount}</td>
                    <td className="py-3 px-4">{tx.price}</td>
                    <td className="py-3 px-4">{formatDate(tx.date)}</td>
                    <td className="py-3 px-4">
                      <span className="capitalize">{tx.source}</span>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </NeonBorderCard>
      </div>
    </div>
  )
}