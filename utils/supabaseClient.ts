
import { createClient } from '@supabase/supabase-js'

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

const supabase = createClient('https://opshqmqagtfidynwftzk.supabase.co', supabaseKey)
export default supabase