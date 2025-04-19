import React, { useEffect, useState } from "react";

interface LeaderboardEntry {
  id: string;
  username: string;
  roundRecord: number;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

interface LeaderboardProps {
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onClose }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard");

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        const data = await response.json();
        setLeaderboardData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard");
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl shadow-xl w-full max-w-4xl p-6 border border-blue-500/30 animate-scaleUp overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Leaderboard
            </h2>
            <p className="text-gray-400 text-sm">Top 50 Players</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            aria-label="Close leaderboard"
          >
            <svg
              className="w-6 h-6 text-gray-400 hover:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
  
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading leaderboard...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-12">{error}</div>
        ) : (
          <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-gray-400 text-sm sticky top-0 bg-slate-900/90 backdrop-blur-sm border-b border-blue-500/20">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">Player</div>
              <div className="col-span-4">Date</div>
              <div className="col-span-2 text-right">Round</div>
            </div>
            <div className="space-y-1.5">
              {leaderboardData.slice(0, 50).map((entry, index) => (
                <div
                  key={entry.id || index}
                  className="grid grid-cols-12 gap-4 px-4 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors items-center"
                >
                  <div className="col-span-1 text-center">
                    <span
                      className={`inline-block font-bold ${
                        index === 0
                          ? "text-yellow-400 text-xl"
                          : index === 1
                          ? "text-gray-300 text-lg"
                          : index === 2
                          ? "text-amber-600 text-lg"
                          : "text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <div className="col-span-5 font-medium text-white truncate">
                    {entry.username}
                  </div>
                  <div className="col-span-4 text-gray-400 text-sm">
                    {new Date(entry.timestamp.seconds * 1000).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="bg-blue-500/20 text-blue-300 font-medium px-2.5 py-1 rounded-full text-sm">
                      Round {entry.roundRecord}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
