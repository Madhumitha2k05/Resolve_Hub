import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export default function SignIn({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/api/users/login', {
        email,
        password
      });
      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
      if (user.role === 'AUTHORITY') {
        navigate('/authority');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 relative z-10">
      <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500 to-cyan-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
      <div className="relative bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-fuchsia-400 to-cyan-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3">
            <LogIn className="h-8 w-8 text-white -rotate-3" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-600 mt-2 font-medium">Please sign in to your account</p>
        </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium border border-red-100">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
          <input 
            type="email" 
            required
            className="w-full rounded-xl bg-white/50 border-white shadow-inner p-3 border focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors" 
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            required
            className="w-full rounded-xl bg-white/50 border-white shadow-inner p-3 border focus:ring-cyan-500 focus:border-cyan-500 transition-colors" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white font-bold px-4 py-3.5 rounded-xl hover:from-fuchsia-700 hover:to-cyan-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-fuchsia-500/30 transform hover:-translate-y-0.5 mt-6"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <p className="mt-8 text-center text-sm font-medium text-slate-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-fuchsia-600 font-bold hover:text-cyan-600 transition-colors">
          Create one now
        </Link>
      </p>
      </div>
    </div>
  );
}
