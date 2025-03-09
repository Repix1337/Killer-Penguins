// app/api/leaderboard/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin-config';

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
    const leaderboardRef = adminDb.collection('leaderboard');
    const snapshot = await leaderboardRef
      .orderBy('roundRecord', 'desc')
      .limit(10)
      .get();

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