import React, { useState, useEffect } from "react";
import { Question, QuizState, DatabaseQuiz } from "../types";
import { Star, Award, Trophy } from "lucide-react";
import { supabase } from "../lib/supabase";
import Cookies from "js-cookie";

interface QuizProps {
  onComplete: (score: number) => void;
}

export function Quiz({ onComplete }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    isComplete: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const { data, error } = await supabase
          .from("quizzes")
          .select("*")
          .order("difficulty");

        if (error) throw error;

        const formattedQuestions = (data as DatabaseQuiz[]).map((q) => ({
          id: parseInt(q.id),
          question: q.question,
          options: q.options,
          correctAnswer: q.correct_answer,
          difficulty: q.difficulty as "easy" | "medium" | "hard",
        }));

        setQuestions(formattedQuestions);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchQuizzes();
  }, []);

  const handleAnswer = async (selectedOption: number) => {
    const correct =
      selectedOption === questions[state.currentQuestion].correctAnswer;
    const newScore = correct ? state.score + 1 : state.score;
    const isComplete = state.currentQuestion === questions.length - 1;

    setState((prev) => ({
      ...prev,
      score: newScore,
      currentQuestion: prev.currentQuestion + 1,
      isComplete,
    }));

    if (isComplete) {
      try {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (userId) {
          await supabase.from("user_progress").insert({
            user_id: userId,
            quiz_id: questions[state.currentQuestion].id,
            score: newScore,
          });

          await supabase
            .from("profiles")
            .update({ total_score: newScore })
            .eq("id", userId);
        }
        onComplete(newScore);
      } catch (err) {
        console.error("Error saving progress:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-pink-600">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (state.isComplete) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <Trophy className="w-16 h-16 mx-auto text-pink-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl">
          Your score: {state.score} / {questions.length}
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-pink-600">No questions available.</p>
      </div>
    );
  }

  const currentQuestion = questions[state.currentQuestion];

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
      <div className="mb-6">
        <p className="text-sm text-pink-600 mb-2">
          Question {state.currentQuestion + 1} of {questions.length}
        </p>
        <h3 className="text-xl font-bold mb-4">{currentQuestion.question}</h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full text-left p-4 rounded-lg border-2 border-pink-100 hover:border-pink-500 hover:bg-pink-50 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
