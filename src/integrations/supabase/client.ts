// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://ekbxebdwfhefucayfmzu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrYnhlYmR3ZmhlZnVjYXlmbXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NDM1MzQsImV4cCI6MjA0OTExOTUzNH0.GL_WSEzcm2yaZsBUgOiBILSbg60_rAcx1TB-RzaqqHA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);