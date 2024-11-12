import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NeonBorderCard = ({ children, className = "" }) => (
    <div className={`relative group ${className}`}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-600 to-purple-500/30 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <div className="relative bg-gray-800 p-6 rounded-lg">
            {children}
        </div>
    </div>
)
const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-gray-700 last:border-0">
    <button
      className="w-full flex justify-between items-center py-4 px-2 hover:bg-gray-700 transition-colors"
      onClick={onClick}
    >
      <span className="font-medium text-left text-gray-200">{question}</span>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </motion.svg>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-4 bg-gray-700 text-gray-300">
            {Array.isArray(answer) ? (
              <ol className="list-decimal list-inside space-y-2">
                {answer.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            ) : (
              <p>{answer}</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

export default function HelpDocumentation() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openFAQs, setOpenFAQs] = useState({})

  const faqData = {
    general: [
      {
        question: "What is EnerXchange?",
        answer: "EnerXchange is a decentralized platform enabling peer-to-peer trading of renewable energy using blockchain technology. It allows individuals and communities to buy and sell renewable energy directly while earning carbon credits."
      },
      {
        question: "How do I get started?",
        answer: [
          "Create an account on the platform",
          "Complete the user verification process",
          "Connect your digital wallet",
          "Browse available energy listings or create your own listing"
        ]
      }
    ],
    trading: [
      {
        question: "How do I list energy for sale?",
        answer: [
          "Navigate to the 'Energy Listing' page",
          "Specify the energy amount, minimum purchase requirement, and energy source",
          "Set your desired price per unit (or use dynamic pricing)",
          "Set the listing expiration time",
          "Confirm the transaction through your connected wallet"
        ]
      },
      {
        question: "How is energy pricing determined?",
        answer: "Energy prices can be set manually by the seller or determined dynamically using Chainlink Oracle data. Prices adjust based on market conditions and demand."
      }
    ],
    verification: [
      {
        question: "What is the verification process?",
        answer: [
          "Submit required identification documents",
          "Provide proof of energy production capability (if selling)",
          "Wait for admin review and approval",
          "Receive verification status"
        ]
      },
      {
        question: "What are carbon credits?",
        answer: "Carbon credits are rewards earned based on your renewable energy production and trading. They represent your contribution to reducing carbon emissions and can be traded or used for platform benefits."
      }
    ]
  }

  const toggleFAQ = (section, index) => {
    setOpenFAQs(prev => ({
      ...prev,
      [`${section}-${index}`]: !prev[`${section}-${index}`]
    }))
  }

  const filterFAQs = (faqs) => {
    return Object.entries(faqs).filter(([section, questions]) =>
      questions.some(({ question, answer }) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          question.toLowerCase().includes(searchLower) ||
          (Array.isArray(answer)
            ? answer.some(item => item.toLowerCase().includes(searchLower))
            : answer.toLowerCase().includes(searchLower))
        )
      })
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold mb-8">Help & Documentation</h1>

        {/* Search Bar */}
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FAQ Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filterFAQs(faqData).map(([section, questions]) => (
            <NeonBorderCard key={section} className="w-full mb-6">
              <h2 className="text-xl font-semibold mb-4 capitalize">{section}</h2>
              {questions.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQs[`${section}-${index}`]}
                  onClick={() => toggleFAQ(section, index)}
                />
              ))}
            </NeonBorderCard>
          ))}
        </motion.div>
      </div>
    </div>
  )
}