import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las credenciales de Supabase en el archivo .env')
}

// CONFIGURACIÓN MÍNIMA - Sin features avanzadas que puedan causar problemas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false, // DESACTIVADO para diagnóstico
    persistSession: true,
    detectSessionInUrl: false, // DESACTIVADO
    storage: window.localStorage,
    storageKey: 'supabase.auth.token'
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
