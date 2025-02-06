import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { Button } from "@/components/ui/button";
import { BarChart3, Clock, Users, Eye } from "lucide-react";

export default function CreatorDashboard() {
  return (
    <div className="min-h-screen bg-background flex">
      <CreatorSidebar />
      <main className="flex-1 p-8">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">Nest Dashboard</h1>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Latest Module Performance */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Latest Module Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="Latest module thumbnail"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Think Outside the Box</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Completion rate: 78%</p>
                    <p>Number of starts: 156</p>
                    <p>Average completion time: 45 minutes</p>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button>Go to module analytics</Button>
                    <Button variant="outline">See comments</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nest Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Nest Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <span className="text-4xl font-bold">640</span>
                  <p className="text-sm text-muted-foreground">Total Learners</p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Summary (Last 30 days)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">2.4k Views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Average time: 35min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Est. Revenue: $1,240</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Go to nest analytics
                </Button>
              </CardContent>
            </Card>

            {/* Classes Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Classes</CardTitle>
                <p className="text-sm text-muted-foreground">Last 30 days</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Most profitable class</h4>
                  <p className="text-sm text-muted-foreground">Advanced React Patterns</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Most active learner</h4>
                  <p className="text-sm text-muted-foreground">Sarah Johnson</p>
                </div>
              </CardContent>
            </Card>

            {/* Latest Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Latest Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No comments yet</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}