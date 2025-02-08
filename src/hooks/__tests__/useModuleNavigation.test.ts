
import { renderHook, act } from '@testing-library/react-hooks';
import { useModuleNavigation } from '../useModuleNavigation';
import { vi } from 'vitest';

describe('useModuleNavigation', () => {
  const mockUpdateProgress = vi.fn();
  const mockPauseAllMedia = vi.fn();

  // Mock useMediaControl
  vi.mock('../useMediaControl', () => ({
    useMediaControl: () => ({
      pauseAllMedia: mockPauseAllMedia
    })
  }));

  const mockNodes = [
    { id: '1', type: 'message', data: { type: 'message' } },
    { id: '2', type: 'router', data: { type: 'router', isOverlay: true } },
    { id: '3', type: 'message', data: { type: 'message' } }
  ];

  beforeEach(() => {
    mockUpdateProgress.mockClear();
    mockPauseAllMedia.mockClear();
  });

  it('initializes with correct starting state', () => {
    const { result } = renderHook(() => 
      useModuleNavigation(mockNodes as any, mockUpdateProgress)
    );

    expect(result.current.currentNodeIndex).toBe(0);
    expect(result.current.hasInteracted).toBe(false);
    expect(result.current.showCompletion).toBe(false);
  });

  it('handles navigation to next node correctly', () => {
    const { result } = renderHook(() => 
      useModuleNavigation(mockNodes as any, mockUpdateProgress)
    );

    act(() => {
      result.current.handleNext();
    });

    expect(mockPauseAllMedia).toHaveBeenCalled();
    expect(result.current.overlayRouter).toBeTruthy();
    expect(mockUpdateProgress).toHaveBeenCalledWith('2');
  });

  it('handles navigation to previous node correctly', () => {
    const { result } = renderHook(() => 
      useModuleNavigation(mockNodes as any, mockUpdateProgress)
    );

    // Move to second node first
    act(() => {
      result.current.handleNext();
    });

    // Then go back
    act(() => {
      result.current.handlePrevious();
    });

    expect(result.current.currentNodeIndex).toBe(0);
    expect(result.current.hasInteracted).toBe(false);
  });
});
