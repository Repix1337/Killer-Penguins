import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase/server";
import { collection, addDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { username, roundRecord } = req.body;

    if (!username || typeof roundRecord !== "number") {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const leaderboardRef = collection(db, "leaderboard");
    await addDoc(leaderboardRef, {
      username,
      roundRecord,
      timestamp: new Date(),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error saving game result:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
