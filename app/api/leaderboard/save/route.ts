import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '@/firebase/config';
import { auth } from 'firebase-admin';
import { getAuth } from 'firebase/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, roundRecord } = body;

    // Get auth token from header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the token
    const token = authHeader.split('Bearer ')[1];

    // Verify the token
    const decodedToken = await auth().verifyIdToken(token);
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Create the leaderboard entry with user data
    const leaderboardEntry = {
      username,
      roundRecord,
      userId: decodedToken.uid,
      userEmail: decodedToken.email,
      timestamp: new Date()
    };

    // Get Firestore instance
    const db = getFirestore(app);
    
    // Save to Firestore
    await addDoc(collection(db, 'leaderboard'), leaderboardEntry);

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error('Error saving game result:', error);
    return NextResponse.json(
      { error: 'Failed to save game result' },
      { status: 500 }
    );
  }
}