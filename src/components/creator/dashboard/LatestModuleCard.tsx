import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LatestModuleCard() {
  return (
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
  );
}