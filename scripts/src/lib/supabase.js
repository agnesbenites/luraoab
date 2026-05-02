import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://bgdkttcdfqpcerslctqs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZGt0dGNkZnFwY2Vyc2xjdHFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQxMzc4NywiZXhwIjoyMDkyOTg5Nzg3fQ.VHJZ42LJjinmCBEmBSQ1UWfroqNTCF2WT7yjwQaFhgQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
