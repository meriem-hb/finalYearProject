import { RecommendationForm } from '@/components/recommendations/RecommendationForm';

export default function RecommendationsPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Personalized Recommendations</h1>
        <p className="text-lg text-foreground/80">Let our AI guide you to the most relevant learning materials based on your progress and preferences.</p>
      </section>
      
      <RecommendationForm />
    </div>
  );
}
