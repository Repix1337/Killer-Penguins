import { NextResponse } from 'next/server';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';
import { db } from '@/firebase/server';

// ✅ Correct function signature for App Router
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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
