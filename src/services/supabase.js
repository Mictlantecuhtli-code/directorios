import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las credenciales de Supabase en el archivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    // Removido flowType: 'pkce' que causaba problemas
  },
  global: {
    headers: {
      'x-client-info': 'directorio-aifa@1.0.0'
    }
  },
  db: {
    schema: 'public'
  },
  // Configuración de reintentos
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper para manejar errores de Supabase
export const handleSupabaseError = (error) => {
  if (error) {
    console.error('Supabase Error:', error)
    return {
      message: error.message || 'Error en la operación',
      code: error.code,
      details: error.details
    }
  }
  return null
}

// Monitorear estado de la conexión
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refrescado automáticamente')
  } else if (event === 'SIGNED_OUT') {
    console.log('Usuario cerró sesión')
  }
})
