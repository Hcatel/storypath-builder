
import { render, screen, fireEvent } from '@testing-library/react';
import { RouterChoices } from '../RouterChoices';
import { RouterNodeData, FlowNode } from '@/types/module';
import '@testing-library/jest-dom';

describe('RouterChoices', () => {
  const mockData: RouterNodeData = {
    type: 'router',
    label: 'Test Router',
    question: 'Test Question',
    choices: [
      { text: 'Choice 1', nextNodeId: 'node1' },
      { text: 'Choice 2', nextNodeId: 'node2' }
    ]
  };

  const mockAvailableNodes: FlowNode[] = [
    { 
      id: 'node1', 
      data: { 
        type: 'message',
        label: 'Node 1',
        title: 'Message 1',
        content: 'Test content 1'
      },
      position: { x: 0, y: 0 },
      type: 'message'
    },
    { 
      id: 'node2', 
      data: { 
        type: 'message',
        label: 'Node 2',
        title: 'Message 2',
        content: 'Test content 2'
      },
      position: { x: 100, y: 0 },
      type: 'message'
    }
  ];

  const mockOnUpdate = jest.fn();
  const mockOnConfigureConditions = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all choices', () => {
    render(
      <RouterChoices
        data={mockData}
        availableNodes={mockAvailableNodes}
        onUpdate={mockOnUpdate}
        onConfigureConditions={mockOnConfigureConditions}
      />
    );

    expect(screen.getByText('Choice 1')).toBeInTheDocument();
    expect(screen.getByText('Choice 2')).toBeInTheDocument();
  });

  it('adds a new choice when Add Choice button is clicked', () => {
    render(
      <RouterChoices
        data={mockData}
        availableNodes={mockAvailableNodes}
        onUpdate={mockOnUpdate}
        onConfigureConditions={mockOnConfigureConditions}
      />
    );

    fireEvent.click(screen.getByText('Add Choice'));

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockData,
      choices: [...mockData.choices, { text: '', nextNodeId: '' }]
    });
  });
});
