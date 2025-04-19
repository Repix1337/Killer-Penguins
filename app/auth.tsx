import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '@/firebase/config';

interface AuthProps {
  onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth(app);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      
      // Save minimal user data to localStorage after successful auth
      const user = userCredential.user;
      localStorage.setItem('authUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }));
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-8 rounded-xl shadow-lg w-full max-w-md 
      border border-[#67E8F9]/30 animate-scaleUp">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 
          bg-clip-text text-transparent">
            {isLogin ? 'Login' : 'Sign Up'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-sky-800/50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg 
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-cyan-500/50"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg 
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-cyan-500/50"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 
            text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 
            transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default Auth;