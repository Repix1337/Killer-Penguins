import { getAuth } from 'firebase/auth';
import app from '@/firebase/config';

export const saveGameResult = async (round: number, username: string): Promise<void> => {
  try {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
      throw new Error('You must be logged in to save your score');
    }

    const token = await user.getIdToken();

    const response = await fetch('/api/leaderboard/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username,
        roundRecord: round,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save game result');
    }

  } catch (error) {
    console.error('Error saving game result:', error);
    throw error;
  }
};