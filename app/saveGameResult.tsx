export const saveGameResult = async (round: number, username: string): Promise<void> => {
  try {
    // Make a simpler version without token validation for now
    const response = await fetch('/api/leaderboard/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

    console.log('Game result saved successfully');
  } catch (error) {
    console.error('Error saving game result:', error);
  }
};