import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Cookies from "js-cookie";
import { Brain, Sparkles, Star } from "lucide-react";

interface AuthFormProps {
  type: "login" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (type === "register") {
        // Sign up the user
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                username: formData.username,
              },
            },
          },
        );

        if (authError) throw authError;

        // Redirect to waiting page with the email
        navigate("/confirm-email", { state: { email: formData.email } });
      } else {
        // Login logic
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) {
          setError("Incorrect email or password.");
          throw authError;
        }

        if (user) {
          console.log("User logged in:", user);
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .single();

          if (profileError && profileError.code === "PGRST116") {
            // Profile does not exist, create it
            const { error: insertError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: user.id,
                  username: user.user_metadata.username,
                  current_level: "Beginner",
                  total_score: 0,
                },
              ]);

            if (insertError) {
              setError("Error creating profile.");
              throw insertError;
            }

            Cookies.set("username", user.user_metadata.username, {
              secure: true,
              sameSite: "strict",
            });
          } else if (profileError) {
            setError("Error fetching profile.");
            throw profileError;
          } else if (profileData) {
            console.log("Profile data:", profileData);
            Cookies.set("username", profileData.username, {
              secure: true,
              sameSite: "strict",
            });
          }
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError((err as Error).message);
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
              {type === "login" ? "Welcome Back!" : "Join the Fun!"}
              <Star className="w-6 h-6 text-yellow-400" />
            </h2>
            <p className="text-gray-600">
              {type === "login"
                ? "Ready to continue learning?"
                : "Create your account and start learning!"}
            </p>
          </div>

          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            {type === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Choose your username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring focus:ring-pink-200 transition-colors"
                  placeholder="e.g., SuperLearner123"
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring focus:ring-pink-200 transition-colors"
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring focus:ring-pink-200 transition-colors"
                placeholder="Your secret password"
                required
                disabled={isLoading}
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
                  {type === "login" ? "Logging in..." : "Creating account..."}
                </span>
              ) : type === "login" ? (
                "Login to Play!"
              ) : (
                "Create Account!"
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              {type === "login" ? (
                <>
                  New here?{" "}
                  <a
                    href="/register"
                    className="text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Create an account
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-pink-600 hover:text-pink-700 font-medium"
                  >
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
