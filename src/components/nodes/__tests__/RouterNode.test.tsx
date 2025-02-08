
import { render, screen, fireEvent } from '@testing-library/react';
import { RouterNode } from '../RouterNode';
import { useReactFlow } from '@xyflow/react';
import { vi } from 'vitest';

// Mock useReactFlow hook
vi.mock('@xyflow/react', () => ({
  useReactFlow: vi.fn(),
  Position: {
    Left: 'left',
    Right: 'right'
  }
}));

describe('RouterNode', () => {
  const mockSetNodes = vi.fn();
  const mockGetNodes = vi.fn();

  beforeEach(() => {
    (useReactFlow as jest.Mock).mockReturnValue({
      setNodes: mockSetNodes,
      getNodes: mockGetNodes
    });
  });

  const defaultProps = {
    id: 'test-router',
    data: {
      type: 'router' as const,
      label: 'Test Router',
      question: 'Test Question',
      choices: [
        { text: 'Choice 1', nextNodeId: 'node1' },
        { text: 'Choice 2', nextNodeId: 'node2' }
      ]
    }
  };

  it('renders router node with question and choices', () => {
    render(<RouterNode {...defaultProps} />);
    
    expect(screen.getByText('Test Question')).toBeInTheDocument();
    expect(screen.getByText('Choice 1')).toBeInTheDocument();
    expect(screen.getByText('Choice 2')).toBeInTheDocument();
  });

  it('handles node deletion', () => {
    mockGetNodes.mockReturnValue([defaultProps]);
    
    render(<RouterNode {...defaultProps} />);
    
    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);
    
    expect(mockSetNodes).toHaveBeenCalled();
  });
});
