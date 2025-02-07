
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Trash2 } from "lucide-react";

type ModuleFlowContextMenuProps = {
  contextMenu: { x: number; y: number; nodeId: string } | null;
  onDeleteNode: () => void;
};

export function ModuleFlowContextMenu({ contextMenu, onDeleteNode }: ModuleFlowContextMenuProps) {
  if (!contextMenu) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: contextMenu.x,
        top: contextMenu.y,
        zIndex: 1000,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <ContextMenu modal={false}>
        <ContextMenuTrigger>
          <div style={{ width: '1px', height: '1px' }} />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem 
            onClick={onDeleteNode}
            className="text-destructive focus:text-destructive flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Node
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
