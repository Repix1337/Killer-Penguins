export const saveGameResult = async (round: number, username: string): Promise<void> => {
  try {
    // Get the token from environment variables or window object
    // In Next.js, you would typically expose this as NEXT_PUBLIC_APP_TOKEN
    const appToken = process.env.NEXT_PUBLIC_APP_TOKEN;
    
    const response = await fetch('/api/leaderboard/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-token': appToken || '',
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