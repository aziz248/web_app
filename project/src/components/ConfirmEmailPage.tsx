import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function ConfirmEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const extractTokenFromUrl = () => {
    const hash = window.location.hash.substring(1); // Remove the '#' from the URL
    const params = new URLSearchParams(hash); // Parse the hash as query parameters
    return params.get('access_token'); // Extract the access token
  };

  const handleEmailConfirmation = async () => {
    const accessToken = extractTokenFromUrl();

    if (accessToken) {
      // Set the session using the access token
      const { data: { user }, error } = await supabase.auth.setSession(accessToken);

      if (error) {
        console.error('Error setting session:', error.message);
        return;
      }

      if (user) {
        // User is authenticated, create their profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              username: user.user_metadata.username,
              current_level: 'Beginner',
              total_score: 0,
            },
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError.message);
        } else {
          console.log('Profile created successfully!');
          // Redirect to home page
          navigate('/');
        }
      }
    } else {
      console.error('Access token not found in URL');
    }
  };

  useEffect(() => {
    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-pink-100 to-pink-200 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-4 border-pink-200">
          <h1 className="text-3xl font-bold mb-4 text-center">Confirming Your Email...</h1>
          <p className="text-gray-600 text-center">
            Please wait while we confirm your email and set up your account.
          </p>
        </div>
      </div>
    </div>
  );
}