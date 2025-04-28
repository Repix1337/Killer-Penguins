import { getAuth } from 'firebase/auth';
export async function updateUserStats(userId: string, round: number, kills: number) {
    const response = await fetch('/api/users/stats', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getIdToken()}`
        },
        body: JSON.stringify({
            userId,
            round,
            kills
        })
    });

    if (!response.ok) {
        throw new Error('Failed to update stats');
    }

    return response.json();
}

async function getIdToken(): Promise<string> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No authenticated user');
    }
    return user.getIdToken();
}
