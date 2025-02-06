
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, BarChart3, Globe2, Lock } from "lucide-react";

interface ModuleStatusProps {
  published: boolean;
  accessType: string;
}

export function ModuleStatus({ published, accessType }: ModuleStatusProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {published ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <AlertCircle className="text-yellow-500" />
            )}
            <span>
              {published ? "Published" : "Draft"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <BarChart3 className="text-muted-foreground" />
            <span>Coming soon</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Access Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {accessType === "public" ? (
              <Globe2 className="text-muted-foreground" />
            ) : (
              <Lock className="text-muted-foreground" />
            )}
            <span className="capitalize">{accessType || "private"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
