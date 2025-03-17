export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface User {
  name: string;
  rank: number;
  score: number;
  level: 'Beginner' | 'Explorer' | 'Master';
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  isComplete: boolean;
}

export interface Profile {
  id: string;
  username: string;
  current_level: string;
  total_score: number;
  created_at: string;
}

export interface DatabaseQuiz {
  id: string;
  level: string;
  question: string;
  options: string[];
  correct_answer: number;
  difficulty: string;
  created_at: string;
}