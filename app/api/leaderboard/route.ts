import { NextResponse } from 'next/server';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';
import { db } from '@/firebase/server';

export async function GET() {
  try {
    const leaderboardRef = collection(db, 'leaderboard');
    const q = query(leaderboardRef, orderBy('roundRecord', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);

    const leaderboard = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(leaderboard);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
