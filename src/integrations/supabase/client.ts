// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lpklokwapmqvfkztxnmh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwa2xva3dhcG1xdmZrenR4bm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4NDg3NDYsImV4cCI6MjA1NDQyNDc0Nn0.nmm1d5VzHjodx-dXlJw9ujTwLEuLX0ZnSnOfxaupvwk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);