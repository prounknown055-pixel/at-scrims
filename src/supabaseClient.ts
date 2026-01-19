import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bhmojnzgcinuglohzabq.supabase.co';
const supabaseAnonKey = 'sb_publishable_tiUgp4_-CvxSEU5GH0k8pw_HEawHV3o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
