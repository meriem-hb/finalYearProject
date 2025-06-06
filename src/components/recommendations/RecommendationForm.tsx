'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { getAiRecommendations, FormState } from '@/app/dashboard/recommendations/actions';
import { mockUserProgress } from '@/lib/mock-data';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Get Recommendations
    </Button>
  );
}

export function RecommendationForm() {
  const initialState: FormState = { message: '', isError: false };
  const [state, formAction] = useFormState(getAiRecommendations, initialState);

  // Prepare default values from mock data
  const defaultLearningHistory = mockUserProgress.learningHistory
    .map(h => `Module: ${h.moduleTitle}, Completed: ${new Date(h.completedDate).toLocaleDateString()}, Time: ${h.timeSpent}`)
    .join('\n');
  
  const defaultQuizResults = mockUserProgress.quizScores
    .map(q => `Quiz: ${q.quizTitle}, Score: ${q.score}/${q.totalQuestions} (${q.percentage}%), Date: ${new Date(q.date).toLocaleDateString()}`)
    .join('\n');

  let parsedRecommendedModules: string[] = [];
  if (state.recommendations?.recommendedModules) {
    try {
      parsedRecommendedModules = JSON.parse(state.recommendations.recommendedModules);
    } catch (e) {
      // If parsing fails, treat it as a single string in an array or handle error
      // For now, this means parsedRecommendedModules will be empty or have raw string if not array
      // The action.ts already tries to handle this and returns string if parsing failed on server.
      // This client-side parsing is a fallback.
      if (typeof state.recommendations.recommendedModules === 'string') {
         // Check if it's already a JSON array string
        if (state.recommendations.recommendedModules.startsWith('[') && state.recommendations.recommendedModules.endsWith(']')) {
            // It is likely a stringified JSON array.
        } else {
            // It's just a plain string, wrap it in an array
            parsedRecommendedModules = [state.recommendations.recommendedModules];
        }
      }
    }
  }


  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Personalized Learning Recommendations</CardTitle>
          <CardDescription>
            Enter your learning history and quiz results to get AI-powered recommendations.
            For demonstration, fields are pre-filled with sample data.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="learningHistory" className="text-lg font-semibold text-foreground/90">Learning History</Label>
              <Textarea
                id="learningHistory"
                name="learningHistory"
                rows={5}
                placeholder="E.g., Completed 'Intro to Algebra' (2 hours spent), Watched 'Chemistry Basics - Chapter 1'..."
                defaultValue={defaultLearningHistory}
                className="mt-2"
                aria-describedby="learningHistory-error"
              />
              {state.fields?.learningHistory && <p id="learningHistory-error" className="text-sm text-destructive mt-1">{state.fields.learningHistory}</p>}
            </div>
            <div>
              <Label htmlFor="quizResults" className="text-lg font-semibold text-foreground/90">Quiz Results</Label>
              <Textarea
                id="quizResults"
                name="quizResults"
                rows={5}
                placeholder="E.g., Algebra Quiz 1: 80% (Weakness: Solving inequalities), Chemistry Quiz 1: 65% (Weakness: Chemical bonds)..."
                defaultValue={defaultQuizResults}
                className="mt-2"
                aria-describedby="quizResults-error"
              />
              {state.fields?.quizResults && <p id="quizResults-error" className="text-sm text-destructive mt-1">{state.fields.quizResults}</p>}
            </div>
            <div>
              <Label htmlFor="userPreferences" className="text-lg font-semibold text-foreground/90">Learning Goals (Optional)</Label>
              <Textarea
                id="userPreferences"
                name="userPreferences"
                rows={3}
                placeholder="E.g., Focus on practical applications, prefer video content, prepare for advanced calculus..."
                className="mt-2"
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.message && (
        <Alert variant={state.isError ? 'destructive' : 'default'} className="max-w-2xl mx-auto">
          {state.isError ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertTitle>{state.isError ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.recommendations && (
        <Card className="w-full max-w-2xl mx-auto shadow-xl mt-8">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center">
              <Sparkles className="h-6 w-6 text-accent mr-2" /> AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground/90 mb-2">Recommended Modules:</h3>
              {parsedRecommendedModules.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {parsedRecommendedModules.map((moduleName, index) => (
                    <li key={index} className="text-foreground/80">{moduleName}</li>
                  ))}
                </ul>
              ) : (
                 typeof state.recommendations.recommendedModules === 'string' && state.recommendations.recommendedModules.startsWith('[') && state.recommendations.recommendedModules.endsWith(']') ? (
                    <p className="text-foreground/80">{JSON.parse(state.recommendations.recommendedModules).join(', ')}</p>
                 ) : (
                    <p className="text-foreground/80">{state.recommendations.recommendedModules || "No specific modules recommended or format error."}</p>
                 )
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground/90 mb-2">Reasoning:</h3>
              <p className="text-foreground/80 whitespace-pre-wrap">{state.recommendations.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
