import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lhhbqrgmmtifmpcopwyx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_8Z73byYR2i0wo7AHx3o3Rg_FS1pwROC'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
