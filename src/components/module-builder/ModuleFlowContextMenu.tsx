
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type ModuleFlowContextMenuProps = {
  contextMenu: { x: number; y: number; nodeId: string } | null;
  onDeleteNode: () => void;
};

export function ModuleFlowContextMenu({ contextMenu, onDeleteNode }: ModuleFlowContextMenuProps) {
  if (!contextMenu) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: contextMenu.x,
        top: contextMenu.y,
        zIndex: 1000,
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div style={{ width: '1px', height: '1px' }} />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onDeleteNode}>
            Delete Node
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
