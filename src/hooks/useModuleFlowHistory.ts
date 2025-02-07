
import { useEffect } from 'react';
import { FlowNode } from '@/types/module';

export function useModuleFlowHistory(
  nodes: FlowNode[],
  setHistory: (updater: (prev: FlowNode[][]) => FlowNode[][]) => void,
  setCurrentIndex: (index: number) => void,
  history: FlowNode[][],
) {
  useEffect(() => {
    if (nodes.length > 0 && history.length === 0) {
      setHistory([nodes]);
      setCurrentIndex(0);
    }
  }, [nodes, history.length, setHistory, setCurrentIndex]);
}
