"use client"

import React, { useState, useEffect, Fragment } from "react";
import { ethers } from "ethers";
import { Dialog, Transition } from "@headlessui/react";
import contractABI from "../config/abi.json";
import { CONTRACT_ADDRESS } from "../config/contractAddress";

const NeonBorderCard = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-600 to-purple-500/30 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
    <div className="relative bg-gray-800 p-6 rounded-lg">{children}</div>
  </div>
);

const Alert = ({ children }) => (
  <div className="p-4 bg-red-900 text-red-200 rounded-md flex items-center space-x-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
    <span>{children}</span>
  </div>
);

export default function UserProfile({ isAdmin = false }) {
  const [contract, setContract] = useState(null);
  const [profile, setProfile] = useState({
    isVerified: false,
    totalEnergyTraded: 0,
    reputationScore: 0,
    lastActivityTime: 0,
    certificationIPFSHash: "",
    certificationTimestamp: 0,
    certificationType: "",
    certificationValid: false,
    certifications: []
  });
  const [userAddress, setUserAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCertification, setNewCertification] = useState({ ipfsHash: "", certType: "" });
  const [showAddCert, setShowAddCert] = useState(false);
  const [addingCert, setAddingCert] = useState(false);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
          setContract(contract);
        } else {
          setError("Please install MetaMask to use this dApp");
        }
      } catch (err) {
        console.error("Failed to initialize contract:", err);
        setError("Failed to initialize contract. Please check your wallet connection.");
      }
    };

    initializeContract();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!contract) {
        setLoading(false);
        return;
      }

      try {
        const signer = await contract.signer;
        const address = await signer.getAddress();
        setUserAddress(address);

        const userProfile = await contract.getUserProfile(address);

        setProfile({
          isVerified: userProfile.isVerified,
          totalEnergyTraded: userProfile.totalEnergyTraded.toString(),
          reputationScore: userProfile.reputationScore.toString(),
          lastActivityTime: userProfile.lastActivityTime.toNumber(),
          certificationIPFSHash: userProfile.certificationIPFSHash,
          certificationTimestamp: userProfile.certificationTimestamp.toNumber(),
          certificationType: userProfile.certificationType,
          certificationValid: userProfile.certificationValid,
          certifications: [] // Assuming this comes from somewhere else
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error fetching profile data");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [contract]);

  const handleAddCertification = async () => {
    if (!newCertification.ipfsHash || !newCertification.certType) return;

    try {
      setAddingCert(true);
      const tx = await contract.updateUserCertification(
        userAddress,
        newCertification.ipfsHash,
        newCertification.certType
      );
      await tx.wait();

      // Refresh profile data
      const updatedProfile = await contract.getUserProfile(userAddress);
      setProfile(prevProfile => ({
        ...prevProfile,
        certificationIPFSHash: updatedProfile.certificationIPFSHash,
        certificationTimestamp: updatedProfile.certificationTimestamp.toNumber(),
        certificationType: updatedProfile.certificationType,
        certificationValid: updatedProfile.certificationValid,
      }));

      setNewCertification({ ipfsHash: "", certType: "" });
      setShowAddCert(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update certification");
    } finally {
      setAddingCert(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {error && <Alert>{error}</Alert>}

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
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
              <NeonBorderCard>
                <div className="flex items-center space-x-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-400">
                    Verification Status
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {profile.isVerified ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span>{profile.isVerified ? "Verified" : "Unverified"}</span>
                </div>
              </NeonBorderCard>

              <NeonBorderCard>
                <div className="text-sm text-gray-400 mb-2">
                  Total Energy Traded
                </div>
                <div className="text-2xl font-bold">
                  {ethers.utils.formatEther(profile.totalEnergyTraded)} EXT
                </div>
              </NeonBorderCard>

              <NeonBorderCard>
                <div className="text-sm text-gray-400 mb-2">
                  Reputation Score
                </div>
                <div className="text-2xl font-bold">
                  {ethers.utils.formatEther(profile.reputationScore)}
                </div>
              </NeonBorderCard>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Certification</h3>
                {isAdmin && (
                  <button
                    onClick={() => setShowAddCert(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update Certification
                  </button>
                )}
              </div>

              <NeonBorderCard>
                {profile.certificationIPFSHash ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Type:</span>
                      <span>{profile.certificationType}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">IPFS Hash:</span>
                      <code className="text-sm bg-gray-700 rounded p-1">
                        {profile.certificationIPFSHash}
                      </code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Status:</span>
                      <span
                        className={
                          profile.certificationValid
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {profile.certificationValid ? "Valid" : "Invalid"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Timestamp:</span>
                      <span>
                        {new Date(profile.certificationTimestamp * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    No certification yet
                  </div>
                )}
              </NeonBorderCard>

              <Transition appear show={showAddCert} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setShowAddCert(false)}>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-100"
                          >
                            Add Certification
                          </Dialog.Title>
                          <div className="mt-2 space-y-4">
                            <input
                              type="text"
                              value={newCertification.ipfsHash}
                              onChange={(e) =>
                                setNewCertification((prev) => ({
                                  ...prev,
                                  ipfsHash: e.target.value,
                                }))
                              }
                              placeholder="Enter IPFS Hash"
                              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={newCertification.certType}
                              onChange={(e) =>
                                setNewCertification((prev) => ({
                                  ...prev,
                                  certType: e.target.value,
                                }))
                              }
                              placeholder="Enter Certification Type"
                              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              type="button"
                              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                              onClick={() => setShowAddCert(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                              onClick={handleAddCertification}
                              disabled={addingCert || !newCertification.ipfsHash || !newCertification.certType}
                            >
                              {addingCert ? "Adding..." : "Add"}
                            </button>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.certifications && profile.certifications.map((cert, index) => (
                  <NeonBorderCard key={index}>
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{cert}</span>
                    </div>
                  </NeonBorderCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}