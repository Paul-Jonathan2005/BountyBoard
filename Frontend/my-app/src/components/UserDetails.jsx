import React, { useEffect, useState } from 'react';
import { fetchUserDetails } from '../services/api';
import { useWallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';
import '../css/UserDetails.css';
import AlgorandLogo from "../assets/image.png";

export default function UserDetails() {
  const [userData, setUserData] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);
  const { algodClient, activeAddress, signData, transactionSigner, wallets } = useWallet()

useEffect(() => {
  const storedWalletInfo = localStorage.getItem('walletInfo');
  if (storedWalletInfo) {
    try {
      const parsed = JSON.parse(storedWalletInfo);
      setWalletInfo(parsed);
    } catch (e) {
      console.error("Failed to parse walletInfo from localStorage:", e);
    }
  }

  const loadUserDetails = async () => {
    try {
      const data = await fetchUserDetails();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  loadUserDetails();
}, []);

useEffect(() => {
  const refreshBalance = async () => {
    if (walletInfo?.address) {
      try {
        const accountInfo = await algodClient.accountInformation(walletInfo.address).do();
        setWalletInfo((prev) => ({
          ...prev,
          balance: Number(accountInfo.amount) / 1e6
        }));
      } catch (error) {
        console.error('Failed to refresh balance:', error);
      }
    }
  };

  refreshBalance();
}, [walletInfo?.address]);

  const handleWalletConnect = async () => {
    const peraWallet = wallets[0];
    try {
      await peraWallet.connect();
      const address = peraWallet.accounts[0].address;
      const accountInfo = await algodClient.accountInformation(address).do();
      const value = {
        address,
        balance: Number(accountInfo.amount) / 1e6      
      }
      setWalletInfo(value);
      localStorage.setItem('walletAddress', address);
      localStorage.setItem('walletInfo', JSON.stringify(value));
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  }

  const handleWalletDisconnect = async () => {
    const peraWallet = wallets[0];
    try {
      await peraWallet.disconnect();
      setWalletInfo(null);
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletInfo');
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  }

  return (
    <div className="user-page-layout">
      <div className="user-details-container">
        <h2 className="user-details-title">User Details</h2>
        {userData ? (
          <div className="user-details-list">
            <div className="user-details-label">First Name:</div>
            <div className="user-details-value">{userData.first_name}</div>

            <div className="user-details-label">Last Name:</div>
            <div className="user-details-value">{userData.last_name}</div>

            <div className="user-details-label">Rating:</div>
            <div className="user-details-value rating-stars">
              {[...Array(5)].map((_, i) => {
                const fill = Math.min(Math.max(userData.rating - i, 0), 1);
                return (
                  <span
                    key={i}
                    className="star"
                    style={{ '--fill': `${fill * 100}%` }}
                  >
                    ★
                  </span>
                );
              })}
            </div>

            <div className="user-details-label">LinkedIn:</div>
            <div className="user-details-value">
              <a href={userData.linkedin_profile_link} target="_blank" rel="noopener noreferrer">
                View Profile
              </a>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <div className="pera-wallet-container">
        {!walletInfo && (
          <button
            className="connect-pera-button"
            onClick={handleWalletConnect}
          >
            Connect to Pera Wallet
          </button>
        )}
        {walletInfo && (
          <div className="wallet-details">
            <div className="wallet-top-section">
              <p className="wallet-balance">{walletInfo.balance}</p>
              <img
                src={AlgorandLogo}
                alt="Algorand Logo"
                className="algorand-logo"
              />
            </div>
            <p className="wallet-address">{walletInfo.address}</p>
            <div className="wallet-bottom-section">
              <button onClick={handleWalletDisconnect} className="disconnect-wallet-button">
                Disconnect Pera Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}