import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

interface GameResult {
  roundRecord: number;
  timestamp: Timestamp;
}

export const saveGameResult = async (round: number): Promise<void> => {
  try {
    const gameResult: GameResult = {
      roundRecord: round,
      timestamp: serverTimestamp() as Timestamp,
    };
    
    await addDoc(collection(db, 'leaderboard'), gameResult);
    console.log('Game result saved successfully');
  } catch (error) {
    console.error('Error saving game result:', error);
  }
};