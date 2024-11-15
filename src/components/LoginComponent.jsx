import { useState, useEffect } from "react";
import {
  useAddress,
  useContract,
  useConnectionStatus,
  useContractWrite,
  useDisconnect,
  ConnectWallet,
  Web3Button,
} from "@thirdweb-dev/react";
import { utils } from "ethers";

import { CONTRACT_ADDRESS } from "../config/contractAddress";

const LoginComponent = () => {
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionToken, setSessionToken] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "",
    message: "",
    isError: false,
  });

  // Get contract instance
  const { contract } = useContract(CONTRACT_ADDRESS);

  // Get contract write functions
  const { mutateAsync: authenticate } = useContractWrite(
    contract,
    "authenticate"
  );
  const { mutateAsync: revokeSession } = useContractWrite(
    contract,
    "revokeSession"
  );

  useEffect(() => {
    if (address) {
      checkSession();
    } else {
      setIsAuthenticated(false);
    }
  }, [address]);

  const checkSession = async () => {
    try {
      const isValid = await contract.call("isSessionValid", [address]);
      setIsAuthenticated(isValid);
    } catch (error) {
      console.error("Error checking session:", error);
      setIsAuthenticated(false);
    }
  };

  const showNotification = (title, message, isError = false) => {
    setToastMessage({ title, message, isError });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogin = async (contract) => {
    const newSessionToken = crypto.randomUUID();
    setSessionToken(newSessionToken);

    const message = JSON.stringify({
      address,
      chainId: 1,
      sessionToken: newSessionToken,
      timestamp: Date.now(),
    });
    const chainId = await contract.provider
      .getNetwork()
      .then((network) => network.chainId);
    if (chainId !== 1 && chainId !== 11155111) {
      throw new Error(
        "Unsupported network. Please switch to Mainnet or Sepolia."
      );
    }

    const signature = await contract.interceptor.sign(message);

    return contract.call("authenticate", [signature, newSessionToken]);
  };

  const handleLogout = async () => {
    try {
      await revokeSession({ args: [] });
      await disconnect();
      setIsAuthenticated(false);
      setSessionToken("");
      showNotification(
        "Logged out successfully",
        "Your session has been ended"
      );
    } catch (error) {
      console.error("Logout error:", error);
      showNotification("Logout failed", error.message, true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            EnerXchange Login
          </h2>
          <p className="mt-2 text-gray-600">
            Connect your wallet to access the platform
          </p>
        </div>

        <div className="space-y-6">
          {!address ? (
            <ConnectWallet
              theme="light"
              btnTitle="Connect Wallet"
              className="w-full"
            />
          ) : !isAuthenticated ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  Wallet connected: {utils.getAddress(address).slice(0, 6)}...
                  {utils.getAddress(address).slice(-4)}
                </p>
              </div>
              <Web3Button
                contractAddress={CONTRACT_ADDRESS}
                action={async (contract) => {
                  try {
                    await handleLogin(contract);
                  } catch (error) {
                    console.error("Login error:", error);
                  }
                }}
                className="w-full"
              >
                Sign & Login
              </Web3Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  Authenticated as {utils.getAddress(address).slice(0, 6)}...
                  {utils.getAddress(address).slice(-4)}
                </p>
              </div>
              <Web3Button
                contractAddress={CONTRACT_ADDRESS}
                action={handleLogout}
                className="w-full !bg-red-600 hover:!bg-red-700"
              >
                Logout
              </Web3Button>
            </div>
          )}

          {connectionStatus === "connecting" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-700">Connecting to wallet...</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed right-4 top-4 z-50">
          <div
            className={`rounded-lg shadow-lg p-4 ${
              toastMessage.isError
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <div className="flex items-center">
              <div className="ml-3 w-0 flex-1">
                <p
                  className={`text-sm font-medium ${
                    toastMessage.isError ? "text-red-800" : "text-green-800"
                  }`}
                >
                  {toastMessage.title}
                </p>
                <p
                  className={`mt-1 text-sm ${
                    toastMessage.isError ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {toastMessage.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginComponent;
