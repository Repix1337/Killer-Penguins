import React, { useState, useEffect } from 'react';
import { getAuth, signOut, User, sendPasswordResetEmail } from "firebase/auth";

interface UserStats {
  gamesPlayed: number;
  highestRound: number;
  lastPlayedDate: string;
  totalKills: number;
  averageRound: number;
  totalRounds: number;
}

interface Props {
  onClose: () => void;
  user: User | null;
}

const UserPanel: React.FC<Props> = ({onClose, user}) => {
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [error, setError] = useState('');
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        try {
          const auth = getAuth();
          await signOut(auth);
          localStorage.removeItem("authUser"); 
          onClose(); 
        } catch (error) {
          console.error("Error signing out:", error);
        }
      };
      const handleResetPassword = async () => {
        if (!user?.email) return;
        
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, user.email);
            setResetEmailSent(true);
            setError('');
        } catch (error) {
            setError('Failed to send reset email. Please try again.');
            console.error("Error sending reset email:", error);
        }
    };

    useEffect(() => {
        const fetchUserStats = async () => {
            if (!user?.uid) return;
            
            try {
                const response = await fetch(`/api/users/stats`, {
                    headers: {
                        'Authorization': `Bearer ${await user.getIdToken()}`
                    }
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }
    
                const stats = await response.json();
                setUserStats(stats);
            } catch (error) {
                console.error('Error fetching user stats:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserStats();
    }, [user]);;

    const formatDate = (timestamp: number) => {
      return new Date(timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
  };

  return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 md:p-6 bg-black/50">
          <div className="animate-scaleUp bg-gradient-to-b from-[#0B1D35] to-[#1E3A8A] 
              p-3 sm:p-4 md:p-6 rounded-xl shadow-lg w-full max-w-[60vw] md:max-w-[60vw] lg:max-w-[60vw] 
              border border-[#67E8F9]/30 max-h-[90vh] overflow-y-auto">
              
              {/* Header */}
              <div className="sticky top-0 flex justify-between items-center mb-6 
                  bg-inherit pt-1 pb-2 border-b border-sky-800/50">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r 
                      from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                      Account Dashboard
                  </h3>
                  <button 
                      onClick={onClose}
                      className="p-1.5 sm:p-2 hover:bg-sky-800/50 rounded-lg transition-colors"
                  >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
              </div>

              {/* User Info Section */}
              <div className="flex flex-col gap-4">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 
                          flex items-center justify-center text-2xl font-bold text-white">
                          {user?.displayName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                          <h4 className="text-xl font-semibold text-white">
                              {user?.displayName || 'Anonymous User'}
                          </h4>
                          <p className="text-blue-300">{user?.email}</p>
                      </div>
                  </div>

                  {/* Enhanced Account Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Account Info */}
                      <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                          <h5 className="text-blue-300 mb-2 font-medium flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Account Info
                          </h5>
                          <div className="space-y-2">
                              <p className="text-white text-sm">
                                  Status: {user?.emailVerified ? 
                                      '✅ Verified' : '⚠️ Unverified'}
                              </p>
                              <p className="text-white text-sm">
                                  Member since: {user?.metadata.creationTime && 
                                      formatDate(Date.parse(user.metadata.creationTime))}
                              </p>
                              
                          </div>
                      </div>

                      {/* Game Statistics */}
                      <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                          <h5 className="text-blue-300 mb-2 font-medium flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              Game Stats
                          </h5>
                          {loading ? (
                              <p className="text-blue-300 text-sm">Loading stats...</p>
                          ) : (
                              <div className="space-y-2">
                                  <p className="text-white text-sm">
                                      Games Played: {userStats?.gamesPlayed || 0}
                                  </p>
                                  <p className="text-white text-sm">
                                      Highest Round: {userStats?.highestRound || 0}
                                  </p>
                                  <p className="text-white text-sm">
                                      Total Kills: {userStats?.totalKills || 0}
                                  </p>
                                  <p className="text-white text-sm">
                                  Avg. Round: {userStats?.averageRound || 0}
                                </p> 
                                <p className="text-white text-sm">
                                  Total Rounds: {userStats?.totalRounds || 0}
                                </p>
                              </div>
                          )}
                      </div>

                      {/* Recent Activity */}
                      <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                          <h5 className="text-blue-300 mb-2 font-medium flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Recent Activity
                          </h5>
                          <div className="space-y-2">
                              <p className="text-white text-sm">
                                  Last Login: {user?.metadata.lastSignInTime && 
                                      formatDate(Date.parse(user.metadata.lastSignInTime))}
                              </p>
                              <p className="text-white text-sm">
                                  Last Game: {userStats?.lastPlayedDate ? formatDate(Date.parse(userStats?.lastPlayedDate )) : 'Never'}
                              </p>
                              
                          </div>
                      </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 mt-2">
                      {user?.email && (
                          <button 
                              onClick={handleResetPassword}
                              className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 
                                  text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 
                                  transition-all duration-200"
                          >
                              Reset Password
                          </button>
                      )}
                      {resetEmailSent && (
                          <p className="text-green-400 text-sm text-center">
                              ✉️ Reset email sent! Please check your inbox.
                          </p>
                      )}
                      {error && (
                          <p className="text-red-400 text-sm text-center">
                              ⚠️ {error}
                          </p>
                      )}
                      <button 
                          onClick={handleLogout}
                          className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 
                              text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-800 
                              transition-all duration-200"
                      >
                          Logout
                      </button>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default UserPanel;