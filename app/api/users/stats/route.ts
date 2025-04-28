import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminDb, auth } from '@/firebase/admin';

export async function PUT(request: NextRequest) {
    try {
        // Verify auth token
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(token);

        // Get request body
        const body = await request.json();
        const { userId, round, kills } = body;

        if (decodedToken.uid !== userId) {
            return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 });
        }

        // Changed to match Firestore rules structure
        const userStatsRef = adminDb.doc(`users/${userId}/stats/${userId}`);
        const userDoc = await userStatsRef.get();
        const currentDate = new Date().toISOString();

        if (userDoc.exists) {
            const currentStats = userDoc.data();
            const gamesPlayed = (currentStats?.gamesPlayed || 0) + 1;
            const totalRounds = (currentStats?.totalRounds || 0) + round;
            const totalKills = (currentStats?.totalKills || 0) + kills;
            const highestRound = Math.max(currentStats?.highestRound || 0, round);

            await userStatsRef.set({
                gamesPlayed,
                totalRounds,
                averageRound: totalRounds / gamesPlayed,
                highestRound,
                totalKills,
                lastPlayedDate: currentDate
            }, { merge: true });
        } else {
            await userStatsRef.set({
                gamesPlayed: 1,
                totalRounds: round,
                averageRound: round,
                highestRound: round,
                totalKills: kills,
                lastPlayedDate: currentDate
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating user stats:', error);
        return NextResponse.json(
            { error: 'Failed to update user stats' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
  try {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await auth.verifyIdToken(token);
      const userId = decodedToken.uid;

      const statsDocRef = adminDb.collection('users').doc(userId).collection('stats').doc(userId);
      const statsDoc = await statsDocRef.get();

      if (!statsDoc.exists) {
          return NextResponse.json({
              gamesPlayed: 0,
              totalRounds: 0,
              averageRound: 0,
              highestRound: 0,
              totalKills: 0,
              lastPlayedDate: null
          });
      }

      return NextResponse.json(statsDoc.data());
  } catch (error) {
      console.error('Error fetching user stats:', error);
      return NextResponse.json(
          { error: 'Failed to fetch user stats' },
          { status: 500 }
      );
  }
}