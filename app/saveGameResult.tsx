import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface GameResult {
  roundRecord: number;
  timestamp: any;
}

export const saveGameResult = async (round: number): Promise<void> => {
  try {
    const gameResult: GameResult = {
      roundRecord: round,
      timestamp: serverTimestamp(),
    };
    
    await addDoc(collection(db, 'leaderboard'), gameResult);
    console.log('Game result saved successfully');
  } catch (error) {
    console.error('Error saving game result:', error);
  }
};