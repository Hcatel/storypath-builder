
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddChoiceButtonProps {
  onClick: (event: React.MouseEvent) => void;
}

export function AddChoiceButton({ onClick }: AddChoiceButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Choice
    </Button>
  );
}
