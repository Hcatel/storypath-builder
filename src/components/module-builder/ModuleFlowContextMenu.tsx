
import { Node } from '@xyflow/react';
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenu,
} from "@/components/ui/context-menu";

type ModuleFlowContextMenuProps = {
  contextMenu: { x: number; y: number; nodeId: string } | null;
  onDeleteNode: () => void;
};

export function ModuleFlowContextMenu({ contextMenu, onDeleteNode }: ModuleFlowContextMenuProps) {
  if (!contextMenu) return null;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div style={{
          position: 'fixed',
          left: contextMenu.x,
          top: contextMenu.y,
          zIndex: 1000,
        }} />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onDeleteNode}>
          Delete Node
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
