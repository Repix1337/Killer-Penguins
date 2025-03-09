// app/api/leaderboard/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin-config';
import { Timestamp } from 'firebase-admin/firestore';

// A function to validate that the request is coming from your app
function isValidRequest(request: NextRequest) {
  // Check for a specific header that your app would set
  const appToken = request.headers.get('x-app-token');
  
  // Validate the token matches your environment variable
  return appToken === process.env.APP_SECRET_TOKEN;
}

export async function POST(request: NextRequest) {
  try {
    // Validate the request is coming from your app
    if (!isValidRequest(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, roundRecord } = body;

    if (!username || typeof roundRecord !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Add additional validation to prevent unrealistic scores
    if (roundRecord < 1 || roundRecord > 1000) {
      return NextResponse.json(
        { error: 'Invalid round record' },
        { status: 400 }
      );
    }

    const gameResult = {
      username,
      roundRecord,
      timestamp: Timestamp.now(),
    };

    const docRef = await adminDb.collection('leaderboard').add(gameResult);
    
    return NextResponse.json({ 
      success: true, 
      id: docRef.id 
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving game result:', error);
    return NextResponse.json(
      { error: 'Failed to save game result' },
      { status: 500 }
    );
  }
}