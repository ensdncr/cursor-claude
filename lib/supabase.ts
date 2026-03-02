import { createClient } from '@supabase/supabase-js'

const PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const TIMEOUT_MS = 3000 // 3 second timeout for Supabase calls

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  return createClient(url, key, {
    global: {
      fetch: (input, init) => {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
        return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer))
      },
    },
  })
}

export function createAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  return createClient(url, key, {
    global: {
      fetch: (input, init) => {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
        return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer))
      },
    },
  })
}
