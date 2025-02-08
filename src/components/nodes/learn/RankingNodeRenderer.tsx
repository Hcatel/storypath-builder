
import { RankingNodeData } from "@/types/module";
import { Card } from "@/components/ui/card";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useState } from "react";

interface RankingNodeRendererProps {
  data: RankingNodeData;
  onRankingChange?: (ranking: string[]) => void;
}

export function RankingNodeRenderer({ data, onRankingChange }: RankingNodeRendererProps) {
  const [items, setItems] = useState<string[]>(data.options);
  const [hasDragged, setHasDragged] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
    setHasDragged(true);
    onRankingChange?.(newItems);
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">{data.title}</h2>
        {data.instructions && (
          <p className="text-muted-foreground mb-8 text-center">{data.instructions}</p>
        )}
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="ranking-list" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col gap-4"
              >
                {items.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`
                          flex items-center gap-4 p-4 bg-background border rounded-lg shadow-sm w-full
                          ${snapshot.isDragging ? 'shadow-lg' : ''}
                        `}
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                          {index + 1}
                        </span>
                        <span className="flex-1">{item}</span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Card>
    </div>
  );
}
