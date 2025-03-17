import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import Cookies from "js-cookie";

export function Navbar() {
  const navigate = useNavigate();
  const username = Cookies.get("username");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    Cookies.remove("username");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-pink-600" />
              <span className="text-xl font-bold text-pink-600">KidsLearn</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/quizzes" className="text-gray-700 hover:text-pink-600">
              Quizzes
            </Link>
            <Link
              to="/leaderboard"
              className="text-gray-700 hover:text-pink-600"
            >
              Leaderboard
            </Link>
            {username ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">Hi, {username}!</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-700 hover:text-pink-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
