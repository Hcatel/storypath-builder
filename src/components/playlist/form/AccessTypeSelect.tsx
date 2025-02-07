
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AccessType = "private" | "public" | "restricted";

interface AccessTypeSelectProps {
  value: AccessType;
  onChange: (value: AccessType) => void;
}

export function AccessTypeSelect({ value, onChange }: AccessTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="accessType">Access Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select access type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="private">Private</SelectItem>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="restricted">Restricted</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
