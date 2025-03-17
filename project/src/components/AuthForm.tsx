import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Cookies from 'js-cookie';
import { Brain, Sparkles, Star } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
}

export function AuthForm({ type }: AuthFormProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (type === 'register') {
        // Sign up the user (do not insert into profiles yet)
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username, // Store username in auth metadata
            },
          },
        });

        if (authError) throw authError;

        // Redirect to email confirmation page
        navigate('/confirm-email', { state: { email } });
      } else {
        // Login logic
        const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

          if (profileData) {
            Cookies.set('username', profileData.username, { secure: true, sameSite: 'strict' });
          }
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-pink-100 to-pink-200 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-4 border-pink-200">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Brain className="w-16 h-16 text-pink-500" />
                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800 flex items-center justify-center gap-2">
              {type === 'login' ? 'Welcome Back!' : 'Join the Fun!'}
              <Star className="w-6 h-6 text-yellow-400" />
            </h2>
            <p className="text-gray-600">
              {type === 'login' 
                ? 'Ready to continue learning?' 
                : 'Create your account and start learning!'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {type === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Choose your username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring focus:ring-pink-200 transition-colors"
                  placeholder="e.g., SuperLearner123"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring focus:ring-pink-200 transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring focus:ring-pink-200 transition-colors"
                placeholder="Your secret password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-4 rounded-xl font-medium hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  {type === 'login' ? 'Logging in...' : 'Creating account...'}
                </span>
              ) : (
                type === 'login' ? 'Login to Play!' : 'Create Account!'
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              {type === 'login' ? (
                <>
                  New here?{' '}
                  <a href="/register" className="text-pink-600 hover:text-pink-700 font-medium">
                    Create an account
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <a href="/login" className="text-pink-600 hover:text-pink-700 font-medium">
                    Login here
                  </a>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}