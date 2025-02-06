import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Clock, Eye } from "lucide-react";

export function NestAnalyticsCard() {
  return (
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
  );
}