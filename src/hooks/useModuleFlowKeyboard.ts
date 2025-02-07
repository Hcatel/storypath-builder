
import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { FlowNode } from '@/types/module';

export function useModuleFlowKeyboard(
  setNodes: (nodes: FlowNode[]) => void,
  history: FlowNode[][],
  currentIndex: number,
  setCurrentIndex: (index: number) => void,
  nodes: FlowNode[],
  setHistory: (updater: (prev: FlowNode[][]) => FlowNode[][]) => void
) {
  const { getNodes } = useReactFlow();

  useEffect(() => {
    const handleKeyboard = async (event: KeyboardEvent) => {
      const selectedNodes = getNodes().filter(node => node.selected);
      
      if ((event.ctrlKey || event.metaKey)) {
        if (event.key === 'z') {
          if (event.shiftKey) {
            // Redo
            if (currentIndex < history.length - 1) {
              const nextState = history[currentIndex + 1];
              setNodes(nextState);
              setCurrentIndex(currentIndex + 1);
            }
          } else {
            // Undo
            if (currentIndex > 0) {
              const previousState = history[currentIndex - 1];
              setNodes(previousState);
              setCurrentIndex(currentIndex - 1);
            }
          }
          event.preventDefault();
        }

        if (selectedNodes.length > 0) {
          if (event.key === 'c') {
            const nodesToCopy = selectedNodes.map(node => ({
              ...node,
              id: `${node.id}-copy`,
              position: { 
                x: node.position.x + 50, 
                y: node.position.y + 50 
              }
            }));
            await navigator.clipboard.writeText(JSON.stringify(nodesToCopy));
          }
          
          if (event.key === 'x') {
            await navigator.clipboard.writeText(JSON.stringify(selectedNodes));
            const newNodes = nodes.filter(node => !selectedNodes.find(n => n.id === node.id));
            setNodes(newNodes);
            setHistory(prev => [...prev.slice(0, currentIndex + 1), newNodes]);
            setCurrentIndex(currentIndex + 1);
          }
        }
        
        if (event.key === 'v') {
          try {
            const clipboardText = await navigator.clipboard.readText();
            const pastedNodes = JSON.parse(clipboardText);
            
            const timestamp = Date.now();
            const newNodes = pastedNodes.map((node: FlowNode, index: number) => ({
              ...node,
              id: `${timestamp}-${index}`,
              position: {
                x: node.position.x + 100,
                y: node.position.y + 100
              }
            }));
            
            const updatedNodes = [...getNodes(), ...newNodes];
            setNodes(updatedNodes);
            setHistory(prev => [...prev.slice(0, currentIndex + 1), updatedNodes]);
            setCurrentIndex(currentIndex + 1);
          } catch (error) {
            console.error('Failed to paste nodes:', error);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [getNodes, setNodes, history, currentIndex, setCurrentIndex, nodes, setHistory]);
}
