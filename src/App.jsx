import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ethers } from "ethers";
// import { ThirdwebProvider } from "@thirdweb-dev/react";
// import { QueryClient, QueryClientProvider } from "react-query";
import Navbar from "./components/Navbar";
import LandingPage from "./components/Landing";
import EnergyMarketplace from "./components/EnergyMarketplace ";
import SellEnergy from "./components/SellEnergy";
import UserProfile from "./components/UserProfile";
import CarbonAnalytics from "./components/CarbonAnalytics";
import TransactionHistory from "./components/TransactionHistory";
import HelpDocumentation from "./components/HelpDocumentation";
import AdminDashboard from "./components/AdminDashboard";
// import LoginComponent from "./components/LoginComponent";
import contractABI from "./config/abi.json";
import { CONTRACT_ADDRESS } from "./config/contractAddress";

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);


  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            contractABI,
            signer
          );

          setContract(contract);

          const accounts = await provider.listAccounts();
          setAccount(accounts[0]);

         
          window.ethereum.on("accountsChanged", (accounts) => {
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

    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  return (
    // <QueryClientProvider client={queryClient}>
    //   <ThirdwebProvider>
        <Router>
          <div>
            {/* <LoginComponent /> */}
            <Navbar account={account} />
            <Routes>
              <Route path="/" element={<LandingPage contract={contract} />} />
              <Route
                path="/marketplace"
                element={<EnergyMarketplace contract={contract} />}
              />
              <Route
                path="/sell-energy"
                element={<SellEnergy contract={contract} />}
              />
              <Route
                path="/user-profile"
                element={<UserProfile contract={contract} />}
              />
              <Route
                path="/carbon-analytics"
                element={<CarbonAnalytics contract={contract} />}
              />
              <Route
                path="/transactions"
                element={<TransactionHistory contract={contract} />}
              />
              <Route
                path="/help"
                element={<HelpDocumentation contract={contract} />}
              />
              <Route
                path="/admin"
                element={<AdminDashboard contract={contract} />}
              />
            </Routes>
          </div>
        </Router>
    //   </ThirdwebProvider>
    // </QueryClientProvider>
  );
}

export default App;
