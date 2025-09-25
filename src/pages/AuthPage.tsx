import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Shield, Mail, Eye, EyeOff, ArrowLeft, Lock } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface AuthPageProps {
  onAuthChange: (user: User | null) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Login successful!');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Account created successfully!');
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <>
      {/* Reusing the same core styles from the landing page for consistency */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }

        .hero-bg {
          background-color: #05070D;
          background-image:
            radial-gradient(at 20% 25%, hsla(212, 90%, 25%, 0.3) 0px, transparent 50%),
            radial-gradient(at 80% 20%, hsla(288, 70%, 30%, 0.25) 0px, transparent 50%),
            radial-gradient(at 50% 80%, hsla(190, 85%, 40%, 0.2) 0px, transparent 50%);
          position: relative;
          overflow: hidden;
        }

        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 50 L50 0 L100 50 L50 100 Z' fill='none' stroke='%23101827' stroke-width='0.5'/%3E%3C/svg%3E");
          background-size: 20px 20px;
          opacity: 0.1;
          animation: pan 60s linear infinite;
        }
        
        @keyframes pan {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 100%; }
        }

        .cta-button {
          background: linear-gradient(90deg, #00C6FF, #0072FF);
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(0, 198, 255, 0.3), 0 0 25px rgba(0, 114, 255, 0.2);
        }

        .cta-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(0, 198, 255, 0.5), 0 0 40px rgba(0, 114, 255, 0.3);
        }
        
        .auth-card {
          background: rgba(14, 22, 39, 0.6);
          border: 1px solid #273142;
          backdrop-filter: blur(10px);
        }
      `}</style>
      
      <div className="min-h-screen text-gray-200 hero-bg">
        {/* Back to Home Link */}
        <div className="absolute top-6 left-6 z-10">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="auth-card rounded-2xl p-8 w-full max-w-md relative z-10">
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-gray-800/50 rounded-full mb-4 border border-gray-700">
                <Shield className="w-8 h-8 text-[#00C6FF]" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Create Your Vault'}
              </h1>
              <p className="text-gray-400">
                {isLogin ? 'Sign in to access your encrypted files' : 'Get started with client-side encryption'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0A101C] border border-[#273142] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#0072FF] focus:ring-1 focus:ring-[#0072FF] transition-colors duration-300"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-[#0A101C] border border-[#273142] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#0072FF] focus:ring-1 focus:ring-[#0072FF] transition-colors duration-300"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full cta-button text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#0E1627] text-gray-500">Or</span>
                </div>
              </div>
            </div>
            
            {/* Google Auth Button */}
             <button
                onClick={handleGoogleAuth}
                className="w-full bg-white/10 border border-gray-700 text-gray-200 font-semibold py-3 px-4 rounded-lg hover:bg-white/20 transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.27 1.44-1.64 3.87-4.56 3.87-2.79 0-5.04-2.3-5.04-5.19s2.25-5.19 5.04-5.19c1.55 0 2.65.64 3.25 1.22l2.2-2.2c-1.5-1.33-3.47-2.18-5.45-2.18-4.42 0-8 3.58-8 8s3.58 8 8 8c4.66 0 7.6-3.25 7.6-7.75 0-.5-.06-.95-.16-1.4z"/></svg>
                <span>Continue with Google</span>
              </button>

            {/* Message Display */}
            {message && (
              <div className={`mt-6 p-3 rounded-lg text-sm text-center border ${
                message.includes('successful')
                  ? 'bg-green-500/10 text-green-300 border-green-500/30'
                  : 'bg-red-500/10 text-red-300 border-red-500/30'
              }`}>
                {message}
              </div>
            )}

            {/* Toggle Form */}
            <div className="mt-6 text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
                className="text-[#00C6FF] hover:underline text-sm transition-colors duration-300"
              >
                {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};