
import { renderHook, act } from '@testing-library/react-hooks';
import { useModuleLearning } from '../useModuleLearning';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('useModuleLearning', () => {
  const mockModule = {
    id: 'test-module',
    nodes: [],
    edges: []
  };

  const mockProgress = {
    user_id: 'test-user',
    module_id: 'test-module',
    completed_nodes: ['1', '2'],
    current_node_id: '2'
  };

  beforeEach(() => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: mockModule,
            error: null
          })
        })
      })
    });
  });

  it('loads module data correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useModuleLearning('test-module', 'test-user')
    );

    await waitForNextUpdate();

    expect(result.current.module).toEqual(mockModule);
  });

  it('updates progress correctly', async () => {
    const mockUpsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as jest.Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: mockProgress,
            error: null
          })
        })
      }),
      upsert: mockUpsert
    });

    const { result, waitForNextUpdate } = renderHook(() => 
      useModuleLearning('test-module', 'test-user')
    );

    await waitForNextUpdate();

    act(() => {
      result.current.updateProgress('3');
    });

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'test-user',
        module_id: 'test-module',
        current_node_id: '3',
        completed_nodes: expect.arrayContaining(['1', '2', '3'])
      })
    );
  });

  it('handles errors gracefully', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: new Error('Test error')
          })
        })
      })
    });

    const { result, waitForNextUpdate } = renderHook(() => 
      useModuleLearning('test-module', 'test-user')
    );

    await waitForNextUpdate();

    expect(result.current.error).toBeTruthy();
  });
});
