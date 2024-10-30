// File: app/AttackButton.tsx
'use client';

import React from 'react';

const AttackButton: React.FC = () => {
  const notifyAttack = async () => {
    const targetPlayerId = 5230850415; // Replace with the actual player ID
    const attackerName = 'PlayerX';
    const attackDetails = 'Fireball caused 50 damage!';

    try {
      const response = await fetch('/api/notifyAttack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetPlayerId, attackerName, attackDetails }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Notification sent:', data.message);
      } else {
        console.error('Failed to send notification:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={notifyAttack}>
      Trigger Attack Notification
    </button>
  );
};

export default AttackButton;
