
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ModuleShareLinkProps {
  moduleId: string;
}

export function ModuleShareLink({ moduleId }: ModuleShareLinkProps) {
  const { toast } = useToast();
  const shareUrl = `${window.location.origin}/modules/${moduleId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "Module link copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Link</CardTitle>
        <CardDescription>
          Share this module directly using a link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-3 py-2 bg-muted rounded-md text-sm"
          />
          <Button onClick={handleCopyLink}>
            Copy Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
