import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { CheckSquare, Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full glass-panel !bg-zinc-900/40 rounded-[3rem] p-16 shadow-2xl relative z-10 border-white/5"
      >
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-indigo-500/20">
            <CheckSquare className="text-white w-8 h-8" />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tight italic gradient-text leading-tight">Access</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Security Protocol — Alpha v1.0</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl font-bold uppercase tracking-tight text-[10px] mb-10 text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Identity UID</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="sleek-input"
              placeholder="OPERATOR@SYSTEM.IO"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Access Cipher</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="sleek-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full button-primary flex items-center justify-center gap-3 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'ESTABLISH CONNECT'}
          </button>
        </form>

        <p className="text-center text-zinc-500 mt-12 text-[10px] font-black uppercase tracking-widest leading-relaxed">
          Unregistered Personnel?{' '}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors border-b border-indigo-400/30">
            Enroll Now
          </Link>
        </p>
      </motion.div>
    </div>

  );
};

export default Login;
