// app/api/leaderboard/route.ts
import { NextResponse } from 'next/server';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import app from '@/firebase/config';

interface LeaderboardEntry {
  id: string;
  username: string;
  roundRecord: number;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export async function GET() {
  try {
    const db = getFirestore(app);
    const leaderboardRef = collection(db, 'leaderboard');
    const q = query(
      leaderboardRef,
      orderBy('roundRecord', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    const entries = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        username: data.username,
        roundRecord: data.roundRecord,
        timestamp: data.timestamp
      } as LeaderboardEntry;
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}