import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import LandingPage from './components/Landing';
import EnergyMarketplace from './components/EnergyMarketplace ';
import SellEnergy from './components/SellEnergy';
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
      <div>
        <Navbar account={account} />
        <div className="">
          <Routes>
            <Route path="/" element={<LandingPage contract={contract} />} />
            <Route path="/marketplace" element={<EnergyMarketplace contract={contract} />} />
            <Route path="/sell-energy" element={<SellEnergy contract={contract} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;