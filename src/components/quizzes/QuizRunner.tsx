'use client';

import type { Quiz, Question, QuestionOption } from '@/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, RotateCcw, Award } from 'lucide-react';
import Link from 'next/link';

interface QuizRunnerProps {
  quiz: Quiz;
}

type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

export function QuizRunner({ quiz }: QuizRunnerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Array<{ questionId: string; selectedOptionId: string; isCorrect: boolean }>>([]);
  const [showResult, setShowResult] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');
  const [progressValue, setProgressValue] = useState(0);

  const currentQuestion: Question | undefined = quiz.questions[currentQuestionIndex];

  useEffect(() => {
    setProgressValue(((currentQuestionIndex) / quiz.questions.length) * 100);
  }, [currentQuestionIndex, quiz.questions.length]);


  const handleOptionSelect = (optionId: string) => {
    if (answerStatus !== 'unanswered') return; // Don't allow changing answer after submission
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || !currentQuestion) return;

    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
    setAnswers([...answers, { questionId: currentQuestion.id, selectedOptionId, isCorrect }]);
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionId(null);
      setAnswerStatus('unanswered');
      setProgressValue(((currentQuestionIndex + 1) / quiz.questions.length) * 100);
    } else {
      setProgressValue(100);
      setShowResult(true);
    }
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setAnswers([]);
    setShowResult(false);
    setAnswerStatus('unanswered');
    setProgressValue(0);
  };

  if (showResult) {
    const score = answers.filter(ans => ans.isCorrect).length;
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <Award className="h-16 w-16 text-accent mx-auto mb-4" />
          <CardTitle className="font-headline text-3xl text-primary">Quiz Completed!</CardTitle>
          <CardDescription className="text-lg">You scored {score} out of {totalQuestions} ({percentage}%)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quiz.questions.map((q, idx) => {
            const userAnswer = answers.find(a => a.questionId === q.id);
            const isCorrect = userAnswer?.isCorrect;
            return (
              <div key={q.id} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 dark:bg-green-900/30 border-green-500' : 'bg-red-100 dark:bg-red-900/30 border-red-500'} border`}>
                <p className="font-semibold">{idx + 1}. {q.text}</p>
                <p className={`text-sm ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  Your answer: {q.options.find(opt => opt.id === userAnswer?.selectedOptionId)?.text || 'Not answered'}
                  {isCorrect ? <CheckCircle className="inline ml-2 h-4 w-4" /> : <XCircle className="inline ml-2 h-4 w-4" />}
                </p>
                {!isCorrect && <p className="text-sm text-muted-foreground">Correct answer: {q.options.find(opt => opt.id === q.correctOptionId)?.text}</p>}
                {q.explanation && <p className="text-xs mt-1 text-muted-foreground italic">Explanation: {q.explanation}</p>}
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={handleRestartQuiz} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" /> Restart Quiz
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/dashboard/quizzes">Back to Quizzes</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="w-full max-w-lg mx-auto text-center">
        <CardHeader>
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle className="font-headline text-2xl text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Quiz data is unavailable or an error occurred.</p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="mx-auto">
            <Link href="/dashboard/quizzes">Return to Quizzes</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  const getOptionClasses = (optionId: string) => {
    if (answerStatus === 'unanswered') return '';
    if (optionId === currentQuestion.correctOptionId) return 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
    if (optionId === selectedOptionId && optionId !== currentQuestion.correctOptionId) return 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
    return 'text-muted-foreground';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <Progress value={progressValue} className="mb-4 h-2" />
        <CardTitle className="font-headline text-2xl text-primary">{quiz.title}</CardTitle>
        <CardDescription>Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-semibold text-foreground/90">{currentQuestion.text}</p>
        <RadioGroup onValueChange={handleOptionSelect} value={selectedOptionId || undefined} disabled={answerStatus !== 'unanswered'}>
          {currentQuestion.options.map((option) => (
            <Label
              key={option.id}
              htmlFor={option.id}
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-150 ${getOptionClasses(option.id)} hover:bg-secondary/50`}
            >
              <RadioGroupItem value={option.id} id={option.id} />
              <span>{option.text}</span>
            </Label>
          ))}
        </RadioGroup>

        {answerStatus === 'correct' && (
          <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" /> Correct! {currentQuestion.explanation && `Explanation: ${currentQuestion.explanation}`}
          </div>
        )}
        {answerStatus === 'incorrect' && (
          <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
            <XCircle className="mr-2 h-5 w-5 inline" /> Incorrect.
            <p className="text-sm mt-1">Correct answer: {currentQuestion.options.find(opt => opt.id === currentQuestion.correctOptionId)?.text}</p>
            {currentQuestion.explanation && <p className="text-xs mt-1">Explanation: {currentQuestion.explanation}</p>}
          </div>
        )}

      </CardContent>
      <CardFooter>
        {answerStatus === 'unanswered' ? (
          <Button onClick={handleSubmitAnswer} disabled={!selectedOptionId} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Show Results'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
