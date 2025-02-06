import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export function ViewToggle({ isCreatorView }: { isCreatorView: boolean }) {
  const navigate = useNavigate();

  const handleToggle = (checked: boolean) => {
    if (checked) {
      navigate("/creator/dashboard");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="view-toggle" className="text-sm text-muted-foreground">
        {isCreatorView ? "Creator View" : "Learner View"}
      </Label>
      <Switch
        id="view-toggle"
        checked={isCreatorView}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}