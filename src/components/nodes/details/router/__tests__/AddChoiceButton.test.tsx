
import { render, screen, fireEvent } from '@testing-library/react';
import { AddChoiceButton } from '../AddChoiceButton';
import '@testing-library/jest-dom';

describe('AddChoiceButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the button with correct text', () => {
    render(<AddChoiceButton onClick={mockOnClick} />);
    expect(screen.getByText('Add Choice')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<AddChoiceButton onClick={mockOnClick} />);
    fireEvent.click(screen.getByText('Add Choice'));
    expect(mockOnClick).toHaveBeenCalled();
  });
});
