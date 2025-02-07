
export interface PlaylistModule {
  id: string;
  position: number;
  module: {
    id: string;
    title: string;
    thumbnail_url: string | null;
    estimated_duration_minutes: number | null;
    updated_at: string;
    module_completions: { count: number }[];
  };
}

