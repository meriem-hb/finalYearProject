
import type { Module, Quiz, UserProgress, SubjectCategory } from '@/types';
import { Calculator, Atom, Leaf, Languages, BookOpen, Globe2, Brain, Cpu, Computer, Banknote, BookCopy, Landmark, Palette } from 'lucide-react'; // Added more icons

export const mockModules: Module[] = [
  {
    id: 'intro-to-algebra',
    title: 'Introduction to Algebra',
    description: 'Learn the fundamentals of algebraic expressions and equations.',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'mathematics algebra',
    estimatedTime: '2 hours',
    content: [
      { type: 'text', value: 'Welcome to Algebra! Algebra is a branch of mathematics that substitutes letters for numbers. An algebraic equation represents a scale, what is done on one side of the scale with a number is also done to the other side of thescale. Numbers are the constants. Alphabets are the variables.' },
      { type: 'image', value: 'https://placehold.co/600x300.png', dataAiHint: 'algebra equation', altText: 'Example of an algebraic equation' },
      { type: 'text', value: 'Variables are symbols, usually letters, that represent a number. Constants are fixed values. Expressions are combinations of variables, constants, and operations.' },
      { type: 'video', value: 'https://placehold.co/600x400.mp4', dataAiHint: 'algebra tutorial' }, // Placeholder, actual video won't play
      { type: 'text', value: 'Solving equations involves finding the value of the variable that makes the equation true. We use inverse operations to isolate the variable.' },
    ],
  },
  {
    id: 'basics-of-chemistry',
    title: 'Basics of Chemistry',
    description: 'Explore the core concepts of chemistry, including atoms, molecules, and reactions.',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'chemistry science',
    estimatedTime: '3 hours',
    content: [
      { type: 'text', value: 'Chemistry is the scientific study of the properties and behavior of matter. It is a natural science that covers the elements that make up matter to the compounds composed of atoms, molecules and ions: their composition, structure, properties, behavior and the changes they undergo during a reaction with other substances.' },
      { type: 'image', value: 'https://placehold.co/600x300.png', dataAiHint: 'molecules atoms', altText: 'Illustration of atoms and molecules' },
      { type: 'text', value: 'Key concepts include atomic structure, chemical bonding, and the periodic table.' },
    ],
  },
  {
    id: 'world-history-overview',
    title: 'World History Overview',
    description: 'A brief journey through major events and civilizations in world history.',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'history ancient',
    estimatedTime: '2.5 hours',
    content: [
      { type: 'text', value: 'World history is the study of past events from a global perspective. This module covers ancient civilizations, major empires, and significant global events.' },
      { type: 'image', value: 'https://placehold.co/600x300.png', dataAiHint: 'historical map', altText: 'Ancient world map' },
    ],
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: 'algebra-quiz-1',
    moduleId: 'intro-to-algebra',
    title: 'Algebra Basics Quiz',
    description: 'Test your understanding of basic algebraic concepts.',
    questions: [
      {
        id: 'q1',
        text: 'What is a variable in algebra?',
        options: [
          { id: 'opt1', text: 'A fixed number' },
          { id: 'opt2', text: 'A symbol representing an unknown value' },
          { id: 'opt3', text: 'An operation like addition' },
        ],
        correctOptionId: 'opt2',
        explanation: 'A variable is a symbol, typically a letter, that stands for a value that may vary.'
      },
      {
        id: 'q2',
        text: 'Solve for x: 2x + 5 = 11',
        options: [
          { id: 'opt1', text: 'x = 2' },
          { id: 'opt2', text: 'x = 3' },
          { id: 'opt3', text: 'x = 8' },
        ],
        correctOptionId: 'opt2',
        explanation: '2x + 5 = 11  =>  2x = 11 - 5  =>  2x = 6  => x = 3.'
      },
    ],
  },
  {
    id: 'chemistry-quiz-1',
    moduleId: 'basics-of-chemistry',
    title: 'Chemistry Fundamentals Quiz',
    description: 'Assess your knowledge of fundamental chemistry concepts.',
    questions: [
      {
        id: 'q1',
        text: 'What is the smallest unit of an element?',
        options: [
          { id: 'opt1', text: 'Molecule' },
          { id: 'opt2', text: 'Compound' },
          { id: 'opt3', text: 'Atom' },
        ],
        correctOptionId: 'opt3',
        explanation: 'An atom is the smallest unit of ordinary matter that forms a chemical element.'
      },
    ],
  },
];

export const mockUserProgress: UserProgress = {
  completedModules: ['intro-to-algebra'],
  quizScores: [
    {
      quizId: 'algebra-quiz-1',
      quizTitle: 'Algebra Basics Quiz',
      score: 1,
      totalQuestions: 2,
      percentage: 50,
      date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    },
  ],
  learningHistory: [
    {
      moduleId: 'intro-to-algebra',
      moduleTitle: 'Introduction to Algebra',
      completedDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      timeSpent: '1 hour 45 minutes',
    },
  ],
};

export const mockSubjectCategories: SubjectCategory[] = [
  { id: 'arabic', name: 'أدب عربي', iconName: 'Languages', questionCount: 0, href: '#' },
  { id: 'natural-sciences', name: 'علوم طبيعية', iconName: 'Leaf', questionCount: 0, href: '#' },
  { id: 'physics', name: 'فيزياء', iconName: 'Atom', questionCount: 0, href: '#' },
  { id: 'math', name: 'رياضيات', iconName: 'Calculator', questionCount: 0, href: '#' },
  { id: 'islamic-studies', name: 'العلوم الاسلامية', iconName: 'BookOpen', questionCount: 0, href: '#' },
  { id: 'foreign-lang-3', name: 'لغة أجنبية ثالثة', iconName: 'BookCopy', questionCount: 0, href: '#' },
  { id: 'english', name: 'لغة انجليزية', iconName: 'Languages', questionCount: 0, href: '#' },
  { id: 'french', name: 'لغة فرنسية', iconName: 'Languages', questionCount: 0, href: '#' },
  { id: 'informatics', name: 'إعلام آلي', iconName: 'Computer', questionCount: 0, href: '#' },
  { id: 'technology', name: 'التكنولوجيا', iconName: 'Cpu', questionCount: 0, href: '#' },
  { id: 'philosophy', name: 'فلسفة', iconName: 'Brain', questionCount: 0, href: '#' },
  { id: 'history-geo', name: 'تاريخ وجغرافيا', iconName: 'Globe2', questionCount: 0, href: '#' },
  { id: 'accounting', name: 'تسيير واقتصاد', iconName: 'Banknote', questionCount: 0, href: '#' },
  // Add more subjects if needed
];


// Helper function to get a module by ID
export const getModuleById = (id: string): Module | undefined => mockModules.find(module => module.id === id);

// Helper function to get a quiz by ID
export const getQuizById = (id: string): Quiz | undefined => mockQuizzes.find(quiz => quiz.id === id);
