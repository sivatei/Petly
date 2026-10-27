import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
// Service-role client: SERVER ONLY. Always check permissions before using it.
export const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
