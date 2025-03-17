import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://unvhxpaxqkgdreduzdcw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVudmh4cGF4cWtnZHJlZHV6ZGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5OTI5MjQsImV4cCI6MjA1NzU2ODkyNH0.HjlHwUDD6J_0Ealzj1-V-JIdfBEeVTq1YvWvye23OBI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);