// app/api/leaderboard/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin-config';
import { Timestamp } from 'firebase-admin/firestore';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, roundRecord } = body;

    if (!username || typeof roundRecord !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request data' },
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