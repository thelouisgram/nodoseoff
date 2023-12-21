
import { createClient } from '@supabase/supabase-js'

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

const supabase = createClient('https://opshqmqagtfidynwftzk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wc2hxbXFhZ3RmaWR5bndmdHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEwMTc1MzksImV4cCI6MjAxNjU5MzUzOX0.NCIs69csmiB7ZmA75-HBwrKWqLse3x99eoo0nt_gzTA')
export default supabase