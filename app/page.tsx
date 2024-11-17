"use client";

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
//import WebApp from '@twa-dev/sdk';
import axios from 'axios';
// Dynamically import MainButton to avoid SSR issues
const MainButton = dynamic(() => import('@twa-dev/sdk/react').then((mod) => mod.MainButton), {
  ssr: false, // Disable server-side rendering for this component
});

const Home: React.FC = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isTelegramEnv, setIsTelegramEnv] = useState<boolean>(false);
  const [buttonContext, setButtonContext] = useState<'purchase' | 'attack'>('purchase');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      console.log("Running inside Telegram WebApp environment");
      tg.ready();
      setIsTelegramEnv(true);

      const telegramUserId = tg.initDataUnsafe?.user?.id;
      if (telegramUserId) {
        setTelegramId(String(telegramUserId));
        console.log("Telegram ID from SDK:", telegramUserId);
      } else {
        console.warn("Telegram user ID not found in initDataUnsafe.");
      }
    } else {
      console.warn("Not running inside Telegram. Please open within Telegram for full functionality.");
    }

    const urlParams = new URLSearchParams(window.location.search);
    const referral = urlParams.get("referral");
    const telegramIdFromURL = urlParams.get("telegramId");

    if (telegramIdFromURL) {
      setTelegramId(telegramIdFromURL);
      console.log("Telegram ID from URL:", telegramIdFromURL);
    } else {
      console.warn("Telegram ID not found in URL query parameters.");
    }

    if (referral) {
      setReferralCode(referral);
      console.log("Referral code from URL:", referral);
    } else {
      console.warn("Referral code not found in URL query parameters.");
    }
  }, []);

  const loginToAPI = async () => {
    if (hasLoggedIn) {
      console.warn("Already logged in. Skipping login.");
      return;
    }

    if (!telegramId || !referralCode) {
      console.error("Cannot proceed: Missing Telegram ID or referral code.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await axios.post(
        'https://user-profiles-184326297587.asia-southeast1.run.app/auth/login',
        {
          auth_data: {
            id: telegramId,
            first_name: "Cobe",
            last_name: "Cheng",
            username: "cobecheng",
            photo_url: "https://example.com/photo.jpg",
            auth_date: Math.floor(Date.now() / 1000),
            hash: "abc123hash"
          },
          id: telegramId,
          first_name: "Cobe",
          last_name: "Cheng",
          username: "cobecheng",
          photo_url: "https://example.com/photo.jpg",
          auth_date: Math.floor(Date.now() / 1000),
          hash: "abc123hash",
          referral_code: referralCode
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
          }
        }
      );

      console.log('Login response:', response.data);
      setHasLoggedIn(true);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    if (telegramId && referralCode && !hasLoggedIn) {
      loginToAPI();
    }
  }, [telegramId, referralCode, hasLoggedIn]);

  const handlePurchase = async () => {
    try {
      if (!telegramId) {
        console.error("No Telegram ID available for purchase.");
        return;
      }
  
      console.log("Attempting to call /api/createPayment with telegramId:", telegramId);
  
      // Call the API route to create a payment invoice
      const response = await fetch('/api/createPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: telegramId }),
      });
  
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
  
      if (response.ok) {
        alert("Payment process initiated!");
      } else {
        console.error("Failed to initiate payment:", data.description || data.error);
        alert("Failed to initiate payment. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating purchase:", error);
      alert("Error occurred while initiating purchase.");
    }
  };
  
  

  const notifyAttack = async () => {
    const targetPlayerId = 5230850415;
    const attackerName = 'PlayerX';
    const attackDetails = 'Fireball caused 50 damage!';

    try {
      const response = await fetch('/api/notifyAttack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPlayerId, attackerName, attackDetails }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Notification sent:', data.message);
        alert('Attack sent!');
      } else {
        console.error('Failed to send notification:', data.error);
        alert('Failed to send attack notification');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred while sending attack');
    }
  };

  const handleMainButtonClick = () => {
    if (buttonContext === 'purchase') {
      handlePurchase();
    } else {
      notifyAttack();
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">RPG Adventure</h1>

        {!hasLoggedIn && !isLoggingIn && (
          <button
            onClick={loginToAPI}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg mb-6"
          >
            Login to API
          </button>
        )}
        {isLoggingIn && (
          <p className="text-yellow-400 text-center mb-6 font-semibold">Logging in...</p>
        )}
        {hasLoggedIn && (
          <>
            <p className="text-green-500 text-center mb-6 font-semibold">You are successfully logged in!</p>

            {/* Toggle Buttons */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setButtonContext('purchase')}
                className={`py-2 px-4 rounded-lg font-bold ${buttonContext === 'purchase' ? 'bg-blue-500' : 'bg-gray-600'}`}
              >
                Buy Stars
              </button>
              <button
                onClick={() => setButtonContext('attack')}
                className={`py-2 px-4 rounded-lg font-bold ${buttonContext === 'attack' ? 'bg-red-500' : 'bg-gray-600'}`}
              >
                Attack
              </button>
            </div>

            {/* MainButton for Purchase or Attack */}
            <MainButton
              text={buttonContext === 'purchase' ? 'Buy 100 Game Stars' : 'Trigger Attack Notification'}
              onClick={handleMainButtonClick}
            />
          </>
        )}

        {/* Debug Information */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-3">Debug Information</h3>
          <p className="mb-2">
            <span className="font-semibold">Telegram ID:</span> {telegramId ? telegramId : "No Telegram ID detected"}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Referral Code:</span> {referralCode ? referralCode : "No Referral Code detected"}
          </p>
          <p>
            <span className="font-semibold">Login Status:</span> {hasLoggedIn ? "Logged in" : "Not logged in"}
          </p>
        </div>

        {/* Telegram Environment Status */}
        {isTelegramEnv ? (
          <p className="text-green-400 text-center mb-4">Running inside Telegram WebApp</p>
        ) : (
          <p className="text-red-400 text-center mb-4">
            Warning: This app is not running inside Telegram. Please open it within Telegram for full functionality.
          </p>
        )}
      </div>
    </main>
  );
};

export default Home;
