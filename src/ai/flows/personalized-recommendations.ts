// src/ai/flows/personalized-recommendations.ts
'use server';

/**
 * @fileOverview A personalized learning recommendation AI agent.
 *
 * - generatePersonalizedRecommendations - A function that generates personalized learning recommendations.
 * - PersonalizedRecommendationsInput - The input type for the generatePersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the generatePersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  learningHistory: z
    .string()
    .describe(
      'The user learning history, containing modules completed and time spent on each.'
    ),
  quizResults: z
    .string()
    .describe('The user quiz results, including scores and areas of weakness.'),
  userPreferences: z
    .string()
    .optional()
    .describe('Optional user preferences or learning goals.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendedModules: z
    .string()
    .describe(
      'A list of recommended learning modules tailored to the user needs, as a JSON array of strings.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of why those modules were recommended, referring to specific weakenesses shown in their learning history and quiz results.'
    ),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function generatePersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert learning recommendation system. You will analyze the user's learning history, quiz results, and preferences to recommend relevant learning modules.

  Learning History: {{{learningHistory}}}
  Quiz Results: {{{quizResults}}}
  User Preferences: {{{userPreferences}}}

  Based on this information, recommend a list of learning modules that will help the user improve their understanding and performance. The recommendedModules must be a JSON array of strings.
  Also explain your reasoning, and refer to specific weaknesses shown in their learning history and quiz results in the reasoning field.
  Ensure the output is valid JSON.
  `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
