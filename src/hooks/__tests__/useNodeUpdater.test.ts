
import { renderHook } from '@testing-library/react';
import { useNodeUpdater } from '../useNodeUpdater';
import { FlowNode, FlowEdge, RouterNodeData, MessageNodeData } from '@/types/module';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('useNodeUpdater', () => {
  const mockSetNodes = jest.fn();
  const mockSetEdges = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a message node without changing edges when nextNodeId is unchanged', () => {
    const initialNodes: FlowNode[] = [{
      id: '1',
      type: 'message',
      position: { x: 0, y: 0 },
      data: {
        type: 'message',
        label: 'Test Message',
        title: 'Old Title',
        content: 'Old content',
        nextNodeId: '2'
      } as MessageNodeData
    }];

    const initialEdges: FlowEdge[] = [{
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'default'
    }];

    const { result } = renderHook(() => 
      useNodeUpdater(initialNodes, initialEdges, mockSetNodes, mockSetEdges)
    );

    // Update only the title
    result.current.onNodeUpdate('1', {
      type: 'message',
      label: 'Test Message',
      title: 'New Title',
      content: 'Old content',
      nextNodeId: '2'
    });

    // Check that nodes were updated
    expect(mockSetNodes).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'New Title'
        })
      })
    ]));

    // Check that edges were not modified
    expect(mockSetEdges).not.toHaveBeenCalled();
  });

  it('should update edges when nextNodeId changes for a message node', () => {
    const initialNodes: FlowNode[] = [{
      id: '1',
      type: 'message',
      position: { x: 0, y: 0 },
      data: {
        type: 'message',
        label: 'Test Message',
        title: 'Title',
        content: 'Content',
        nextNodeId: '2'
      } as MessageNodeData
    }];

    const initialEdges: FlowEdge[] = [{
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'default'
    }];

    const { result } = renderHook(() => 
      useNodeUpdater(initialNodes, initialEdges, mockSetNodes, mockSetEdges)
    );

    // Update nextNodeId
    result.current.onNodeUpdate('1', {
      type: 'message',
      label: 'Test Message',
      title: 'Title',
      content: 'Content',
      nextNodeId: '3'
    });

    // Check that nodes were updated
    expect(mockSetNodes).toHaveBeenCalled();

    // Check that edges were updated with new target
    expect(mockSetEdges).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        source: '1',
        target: '3'
      })
    ]));
  });

  it('should correctly handle router node choice updates', () => {
    const initialNodes: FlowNode[] = [{
      id: '1',
      type: 'router',
      position: { x: 0, y: 0 },
      data: {
        type: 'router',
        label: 'Test Router',
        question: 'Test Question',
        choices: [
          { text: 'Choice 1', nextNodeId: '2' },
          { text: 'Choice 2', nextNodeId: '3' }
        ]
      } as RouterNodeData
    }];

    const initialEdges: FlowEdge[] = [
      {
        id: 'e1-2-0',
        source: '1',
        target: '2',
        sourceHandle: 'choice-0',
        type: 'default'
      },
      {
        id: 'e1-3-1',
        source: '1',
        target: '3',
        sourceHandle: 'choice-1',
        type: 'default'
      }
    ];

    const { result } = renderHook(() => 
      useNodeUpdater(initialNodes, initialEdges, mockSetNodes, mockSetEdges)
    );

    // Update router choices
    result.current.onNodeUpdate('1', {
      type: 'router',
      label: 'Test Router',
      question: 'Test Question',
      choices: [
        { text: 'Choice 1', nextNodeId: '4' },
        { text: 'Choice 2', nextNodeId: '3' }
      ]
    });

    // Check that nodes were updated
    expect(mockSetNodes).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        data: expect.objectContaining({
          choices: expect.arrayContaining([
            expect.objectContaining({ nextNodeId: '4' })
          ])
        })
      })
    ]));

    // Check that edges were updated correctly
    expect(mockSetEdges).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          source: '1',
          target: '4',
          sourceHandle: 'choice-0'
        }),
        expect.objectContaining({
          source: '1',
          target: '3',
          sourceHandle: 'choice-1'
        })
      ])
    );
  });
});
