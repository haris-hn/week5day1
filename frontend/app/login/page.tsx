'use client';

import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? 'login' : 'register';
    
    try {
      const res = await fetch(`http://localhost:3001/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      if (isLogin) {
        localStorage.setItem('user', JSON.stringify(data));
        toast.success('Welcome back to StreamVibe!');
        setTimeout(() => window.location.href = '/', 1000);
      } else {
        toast.success('Account created! Please sign in.');
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-6 text-white">
      <Toaster position="top-center" />
      
      {/* Cinematic Ambient Glow */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(229,0,0,0.05),transparent_70%)] pointer-events-none"></div>

      <div className="relative w-full max-w-sm z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin ? 'Enter your details to continue' : 'Join the community today'}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="group relative">
            <User className="absolute left-0 text-gray-600 group-focus-within:text-[#E50000] transition-colors" size={18} />
            <input 
              name="username"
              type="text" 
              placeholder="Username"
              required
              onChange={handleChange}
              className="w-full bg-transparent border-b border-[#262626] py-3 pl-8 text-white placeholder-gray-600 focus:border-[#E50000] focus:outline-none transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="group relative">
            <Lock className="absolute left-0 text-gray-600 group-focus-within:text-[#E50000] transition-colors" size={18} />
            <input 
              name="password"
              type="password" 
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full bg-transparent border-b border-[#262626] py-3 pl-8 text-white placeholder-gray-600 focus:border-[#E50000] focus:outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E50000] hover:text-white transition-all active:scale-[0.98] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>{isLogin ? 'Login' : 'Register'} <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            {isLogin ? (
              <>Don't have an account? <span className="text-[#E50000] font-bold">Register</span></>
            ) : (
              <>Already have an account? <span className="text-[#E50000] font-bold">Login</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}