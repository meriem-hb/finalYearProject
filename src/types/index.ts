
export interface ContentItem {
  type: 'text' | 'image' | 'video';
  value: string;
  dataAiHint?: string; // For images
  altText?: string; // For images
}

export interface Module {
  id:string;
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  content: ContentItem[];
  estimatedTime: string; // e.g., "1 hour", "30 minutes"
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  moduleId: string; // Link to a module
  description: string;
  questions: Question[];
}

export interface UserProgress {
  completedModules: string[]; // array of module IDs
  quizScores: Array<{
    quizId: string;
    quizTitle: string;
    score: number; // Number of correct answers
    totalQuestions: number;
    percentage: number;
    date: string; // ISO string
  }>;
  learningHistory: Array<{
    moduleId: string;
    moduleTitle: string;
    completedDate: string; // ISO string
    timeSpent: string; // e.g., "45 minutes"
  }>;
}

// For Firebase user profile combined with Auth data
export interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null; // From Firebase Auth, can be updated from profile
  username?: string; // Custom username from Firestore profile
  photoURL?: string | null; // From Firebase Auth
  createdAt?: string; // ISO string, from Firestore profile
  interests?: string[]; // From Firestore profile
}

// Updated for the new dashboard design & Firestore integration
export interface CommunityQuestion {
  id: string; // Firestore document ID
  title: string;
  content: string; // Full content of the question
  tags: string[]; // Array of tags
  votes: number;
  answersCount: number;
  views: number;
  subject?: string; // Optional: Subject of the question
  gradeLevel?: string; // Optional: Grade level for the question
  questionType?: string; // Optional: Type of question
  authorId: string; // UID of the author
  authorName: string; // displayName or username of the author
  authorPhotoURL?: string | null; // Author's photo URL
  createdAt: string; // ISO string representation of the Firestore Timestamp (will be converted from Timestamp)
}

export interface Answer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string | null;
  content: string;
  createdAt: string; // ISO string
  votes: number;
  isAccepted?: boolean;
}

export interface SubjectCategory {
  id: string;
  name: string;
  iconName: string; // Lucide icon name
  questionCount: number;
  href?: string; // Optional link for the category
}

