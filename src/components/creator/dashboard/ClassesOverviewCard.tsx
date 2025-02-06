import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ClassesOverviewCard() {
  return (
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
  );
}