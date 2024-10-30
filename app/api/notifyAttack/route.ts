import { NextResponse } from 'next/server';
import players from '../../../data';

export async function POST(request: Request) {
  try {
    const { targetPlayerId, attackerName, attackDetails } = await request.json();

    // Find player in the database
    const player = players.find((p) => p.playerId === targetPlayerId);

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Send notification using Telegram API
    const telegramResponse = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: player.telegramId,
        text: `🚨 You are under attack! 🚨\n\n${attackerName} has attacked you!\nDetails: ${attackDetails}`,
      }),
    });

    if (!telegramResponse.ok) {
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Notification sent successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
