export const saveGameResult = async (round: number, username: string): Promise<void> => {
  try {
    const response = await fetch("/api/saveGameResult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, round }),
    });

    if (!response.ok) {
      throw new Error("Failed to save game result");
    }

    console.log("Game result saved successfully");
  } catch (error) {
    console.error("Error saving game result:", error);
  }
};
