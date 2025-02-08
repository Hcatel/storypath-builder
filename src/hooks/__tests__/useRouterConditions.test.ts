
import { renderHook } from '@testing-library/react-hooks';
import { useRouterConditions } from '../useRouterConditions';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('useRouterConditions', () => {
  const mockConditions = [
    {
      id: '1',
      source_node_id: 'test-node',
      condition_type: 'equals',
      condition_value: 'test',
      priority: 0
    }
  ];

  beforeEach(() => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockConditions,
            error: null
          })
        })
      })
    });
  });

  it('returns empty array when no nodeId is provided', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useRouterConditions(undefined)
    );

    expect(result.current.data).toEqual([]);
  });

  it('fetches conditions for given nodeId', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useRouterConditions('test-node')
    );

    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockConditions);
  });

  it('handles error cases', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: null,
            error: new Error('Test error')
          })
        })
      })
    });

    const { result, waitForNextUpdate } = renderHook(() => 
      useRouterConditions('test-node')
    );

    await waitForNextUpdate();

    expect(result.current.error).toBeTruthy();
  });
});
