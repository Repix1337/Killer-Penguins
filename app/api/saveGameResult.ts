import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { username, round } = req.body;

    if (!username || typeof round !== "number") {
      return res.status(400).json({ error: "Invalid request data" });
    }

    await addDoc(collection(db, "leaderboard"), {
      username,
      roundRecord: round,
      timestamp: serverTimestamp(),
    });

    res.status(200).json({ message: "Game result saved successfully" });
  } catch (error) {
    console.error("Error saving game result:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
