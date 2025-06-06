'use server';

import { generatePersonalizedRecommendations, PersonalizedRecommendationsInput, PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-recommendations';
import { z } from 'zod';

const RecommendationsFormSchema = z.object({
  learningHistory: z.string().min(10, "Learning history is too short."),
  quizResults: z.string().min(10, "Quiz results are too short."),
  userPreferences: z.string().optional(),
});

export interface FormState {
  message: string;
  fields?: Record<string, string>;
  recommendations?: PersonalizedRecommendationsOutput;
  isError: boolean;
}

export async function getAiRecommendations(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = RecommendationsFormSchema.safeParse({
    learningHistory: formData.get('learningHistory'),
    quizResults: formData.get('quizResults'),
    userPreferences: formData.get('userPreferences'),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
      isError: true,
    };
  }

  const inputData: PersonalizedRecommendationsInput = validatedFields.data;

  try {
    const recommendations = await generatePersonalizedRecommendations(inputData);
    // Attempt to parse recommendedModules
    try {
      const parsedModules = JSON.parse(recommendations.recommendedModules);
      if (!Array.isArray(parsedModules) || !parsedModules.every(item => typeof item === 'string')) {
        throw new Error("Recommended modules is not an array of strings.");
      }
       return {
        message: "Recommendations generated successfully!",
        recommendations: {
          ...recommendations,
          recommendedModules: JSON.stringify(parsedModules) // Keep it as string for consistency for now
        },
        isError: false,
      };
    } catch (parseError) {
      console.error("Error parsing recommendedModules:", parseError);
      return {
        message: "AI generated recommendations, but module format was unexpected. Displaying raw data.",
        recommendations: {
          ...recommendations,
          recommendedModules: recommendations.recommendedModules // as string
        },
        isError: false, // Still show reasoning
      };
    }

  } catch (error) {
    console.error("Error generating recommendations:", error);
    return {
      message: "Failed to generate recommendations. Please try again.",
      isError: true,
    };
  }
}
