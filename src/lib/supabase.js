import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging - remove this later
console.log('Environment check:')
console.log('URL exists:', !!supabaseUrl)
console.log('Key exists:', !!supabaseKey)
console.log('URL value:', supabaseUrl)

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)