// File: pages/api/createPayment.ts

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type TelegramInvoiceResponse = {
  ok: boolean;
  result?: any;
  description?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    const botToken = process.env.BOT_TOKEN;


    if (!botToken) {
      console.error("Missing Telegram configuration: botToken or providerToken is empty.");
      return res.status(500).json({ error: 'Missing Telegram configuration' });
    }

    const invoicePayload = {
      chat_id: userId,
      title: "100 Game Stars",
      description: "Purchase 100 Game Stars for in-game use",
      payload: "purchase_game_stars",
      providerToken: "",
      currency: "XTR",
      prices: JSON.stringify([{ label: "100 Game Stars", amount: 1 }]), // JSON.stringify for nested arrays
    };

    // Manually encode payload as URLSearchParams
    const encodedPayload = new URLSearchParams(invoicePayload as any).toString();
    console.log("Encoded payload:", encodedPayload);

    const response = await axios.post<TelegramInvoiceResponse>(
      `https://api.telegram.org/bot${botToken}/sendInvoice`,
      encodedPayload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Log the response from Telegram for debugging
    console.log("Telegram API response:", response.data);

    if (response.data.ok) {
      res.status(200).json(response.data);
    } else {
      console.error("Failed to create payment invoice:", response.data.description);
      res.status(500).json({ error: 'Failed to create payment invoice', description: response.data.description });
    }
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
}
