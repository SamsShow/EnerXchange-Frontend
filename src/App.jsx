import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import OwnerDashboard from './components/OwnerDasboard';
import SellEnergy from './components/SellEnergy';
import BuyEnergy from './components/BuyEnergy';
import contractABI from './config/abi.json';
import { CONTRACT_ADDRESS } from './config/contractAddress';

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
          
          setContract(contract);

          const accounts = await provider.listAccounts();
          setAccount(accounts[0]);

          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });
        } catch (error) {
          console.error("Failed to initialize the ethereum environment", error);
        }
      } else {
        console.log("Please install MetaMask!");
      }
    };

    init();

    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar account={account} />
        <div className="container mx-auto mt-8">
          <Routes>
            <Route path="/" element={<OwnerDashboard contract={contract} />} />
            <Route path="/sell" element={<SellEnergy contract={contract} />} />
            <Route path="/buy" element={<BuyEnergy contract={contract} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;