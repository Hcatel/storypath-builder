import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LatestCommentsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">No comments yet</p>
      </CardContent>
    </Card>
  );
}