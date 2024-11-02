"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false); // State to prevent multiple logins
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false); // State to track login status

  useEffect(() => {
    // First, try to initialize the Telegram WebApp SDK
    if (window.Telegram && window.Telegram.WebApp) {
      console.log("Telegram WebApp SDK detected");
      const tg = window.Telegram.WebApp;
      tg.ready(); // Mark the WebApp as ready
      const initDataUnsafe = tg.initDataUnsafe;

      if (initDataUnsafe) {
        console.log("initDataUnsafe found");
        const telegramUserId = initDataUnsafe.user?.id;

        if (telegramUserId) {
          setTelegramId(String(telegramUserId));
          console.log("Telegram ID from SDK:", telegramUserId);
        } else {
          console.warn("Telegram user ID not found in initDataUnsafe.");
        }
      } else {
        console.error("initDataUnsafe is not available.");
      }
    } else {
      console.warn("Telegram WebApp SDK not found. Are you testing within Telegram?");
    }

    // Fallback: Extract data from URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const telegramIdFromURL = queryParams.get('telegramId');
    const referralFromURL = queryParams.get('referral');

    if (telegramIdFromURL) {
      setTelegramId(telegramIdFromURL);
      console.log("Telegram ID from URL:", telegramIdFromURL);
    } else {
      console.error("Telegram ID not found in URL query parameters.");
    }

    if (referralFromURL) {
      setReferralCode(referralFromURL);
      console.log("Referral code from URL:", referralFromURL);
    } else {
      console.warn("Referral code not found in URL query parameters.");
    }
  }, []);

  // Function to send login request to API
  const loginToAPI = async () => {
    if (hasLoggedIn) {
      console.warn("Login has already been attempted. Skipping.");
      return;
    }

    if (!telegramId) {
      console.error("Cannot proceed: Missing Telegram ID.");
      return;
    }

    if (!referralCode) {
      console.error("Cannot proceed: Missing referral code.");
      return;
    }

    setIsLoggingIn(true); // Set logging in state

    try {
      console.log('Attempting login with telegramId:', telegramId, 'and referralCode:', referralCode);
      const response = await axios.post('https://user-profiles-184326297587.asia-southeast1.run.app/auth/login', {
        auth_data: {
          id: telegramId,
          first_name: "Cobe",
          last_name: "Cheng",
          username: "cobecheng",
          photo_url: "https://example.com/photo.jpg",
          auth_date: Math.floor(Date.now() / 1000),
          hash: "abc123hash" // This is just a placeholder
        },
        id: telegramId,
        first_name: "Cobe",
        last_name: "Cheng",
        username: "cobecheng",
        photo_url: "https://example.com/photo.jpg",
        auth_date: Math.floor(Date.now() / 1000),
        hash: "abc123hash",
        referral_code: referralCode
      }, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJfaWQiOjAsImV4cCI6MTczMDk1MzU4N30.oNRtBSi6ONrlqezZkOVmUDO4AzwvHw4E5I1r-vMpwXE`
        }
      });

      console.log('Login response:', response.data);
      setHasLoggedIn(true); // Mark user as logged in after successful login
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false); // Reset logging in state
    }
  };

  // Automatically call the login function when referralCode and telegramId are set
  useEffect(() => {
    if (telegramId && referralCode && !hasLoggedIn) {
      loginToAPI();
    }
  }, [telegramId, referralCode, hasLoggedIn]);

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
          <p className="text-green-500 text-center mb-6 font-semibold">You are successfully logged in!</p>
        )}

        {/* Display debug information */}
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
      </div>
    </main>
  );
}
