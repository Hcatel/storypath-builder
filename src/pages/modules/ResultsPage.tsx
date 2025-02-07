
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

export default function ResultsPage() {
  const { id } = useParams();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["module-analytics", id],
    queryFn: async () => {
      const { data: completions, error } = await supabase
        .from("module_completions")
        .select("*, profiles(username)")
        .eq("module_id", id)
        .order("completed_at", { ascending: false });

      if (error) throw error;

      // Calculate average score and completion time
      const avgScore =
        completions?.reduce((sum, c) => sum + (c.score || 0), 0) /
          (completions?.length || 1) || 0;
      const avgTime =
        completions?.reduce((sum, c) => sum + (c.time_spent_seconds || 0), 0) /
          (completions?.length || 1) || 0;

      // Prepare data for score distribution chart
      const scoreDistribution = completions?.reduce((acc: any, curr) => {
        const scoreRange = Math.floor((curr.score || 0) / 10) * 10;
        const key = `${scoreRange}-${scoreRange + 9}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(scoreDistribution || {}).map(
        ([range, count]) => ({
          range,
          count,
        })
      );

      return {
        completions,
        avgScore,
        avgTime,
        chartData,
        totalCompletions: completions?.length || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Module Results</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.totalCompletions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {analytics?.avgScore.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {Math.round(analytics?.avgTime || 0)}s
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>
            Distribution of scores across all completions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.chartData}>
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Completions</CardTitle>
          <CardDescription>
            List of recent module completions with details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics?.completions?.map((completion) => (
                <TableRow key={completion.id}>
                  <TableCell>
                    {completion.profiles?.username || "Anonymous"}
                  </TableCell>
                  <TableCell>{completion.score || "N/A"}%</TableCell>
                  <TableCell>
                    {completion.time_spent_seconds
                      ? `${completion.time_spent_seconds}s`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(completion.completed_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {completion.feedback || "No feedback"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
