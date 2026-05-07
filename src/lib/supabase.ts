import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Mock client for UI testing if credentials are missing
const mockClient = {
  auth: {
    signInWithPassword: async () => ({ data: { user: { id: '1' } }, error: null }),
    signUp: async () => ({ data: { user: { id: '1' } }, error: null }),
    getUser: async () => ({ data: { user: { id: '1', email: 'test@takshashilauniv.ac.in' } } }),
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
    insert: async () => ({ data: null, error: null }),
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: {}, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: 'https://example.com/note.pdf' } }),
    }),
  },
  channel: () => ({
    on: () => ({ subscribe: () => ({}) }),
  }),
  removeChannel: () => ({}),
} as any

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : mockClient
