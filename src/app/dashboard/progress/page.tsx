'use client'; // Required for Recharts based components

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockUserProgress, mockModules, mockQuizzes } from "@/lib/mock-data";
import type { UserProgress } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle, Percent, BookOpenText, TrendingUp } from "lucide-react";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  score: {
    label: "Score (%)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function ProgressPage() {
  const userProgress: UserProgress = mockUserProgress; // In a real app, fetch this data

  const totalModules = mockModules.length;
  const completedModulesCount = userProgress.completedModules.length;
  const moduleCompletionPercentage = totalModules > 0 ? Math.round((completedModulesCount / totalModules) * 100) : 0;

  const quizChartData = userProgress.quizScores.map(score => ({
    name: score.quizTitle.length > 20 ? score.quizTitle.substring(0,18) + '...' : score.quizTitle,
    score: score.percentage,
  }));


  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Your Learning Progress</h1>
        <p className="text-lg text-foreground/80">Track your achievements and stay motivated on your learning journey.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
                <BookOpenText className="h-8 w-8 text-accent" />
                <CardTitle className="font-headline text-xl text-primary">Modules Completed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{completedModulesCount} <span className="text-2xl text-muted-foreground">/ {totalModules}</span></div>
            <Progress value={moduleCompletionPercentage} className="mt-2 h-3" />
            <p className="text-sm text-muted-foreground mt-1">{moduleCompletionPercentage}% of modules completed</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
                <Percent className="h-8 w-8 text-accent" />
                <CardTitle className="font-headline text-xl text-primary">Average Quiz Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {userProgress.quizScores.length > 0 ? (
              <>
                <div className="text-4xl font-bold text-primary">
                  {Math.round(userProgress.quizScores.reduce((acc, curr) => acc + curr.percentage, 0) / userProgress.quizScores.length)}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">Across {userProgress.quizScores.length} quizzes</p>
              </>
            ) : (
              <p className="text-lg text-muted-foreground">No quiz scores yet.</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-8 w-8 text-accent" />
                <CardTitle className="font-headline text-xl text-primary">Learning Streak</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
             {/* Placeholder for streak */}
            <div className="text-4xl font-bold text-primary">7 <span className="text-2xl text-muted-foreground">days</span></div>
            <p className="text-sm text-muted-foreground mt-1">Keep up the great work!</p>
          </CardContent>
        </Card>
      </section>

      {userProgress.quizScores.length > 0 && (
        <section>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">Quiz Performance</CardTitle>
              <CardDescription>Your scores on recent quizzes.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] sm:h-[400px] w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quizChartData} margin={{ top: 5, right: 20, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      angle={-30} 
                      textAnchor="end" 
                      height={60} 
                      interval={0} 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} unit="%" />
                    <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.3)'}} content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>
      )}

      <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">Learning History</CardTitle>
            <CardDescription>Modules you have completed and your quiz attempts.</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold text-foreground/90 mb-3">Completed Modules</h3>
            {userProgress.learningHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Completed On</TableHead>
                    <TableHead>Time Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userProgress.learningHistory.map((item) => (
                    <TableRow key={item.moduleId}>
                      <TableCell className="font-medium">{item.moduleTitle}</TableCell>
                      <TableCell>{new Date(item.completedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{item.timeSpent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">No modules completed yet.</p>
            )}

            <h3 className="text-lg font-semibold text-foreground/90 mt-6 mb-3">Quiz History</h3>
            {userProgress.quizScores.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userProgress.quizScores.map((score) => (
                    <TableRow key={score.quizId}>
                      <TableCell className="font-medium">{score.quizTitle}</TableCell>
                      <TableCell>{new Date(score.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{score.score}/{score.totalQuestions} ({score.percentage}%)</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">No quiz attempts yet.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
