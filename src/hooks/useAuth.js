import { useState, useEffect, useRef } from 'react'
import { supabase } from '../services/supabase'

/**
 * Hook personalizado para manejar autenticación y permisos
 * CON CORRECCIONES PARA EVITAR TRABAS AL CAMBIAR DE VENTANA
 */
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [isDirector, setIsDirector] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Refs para prevenir race conditions
  const isCheckingSession = useRef(false)
  const sessionCheckTimeout = useRef(null)

  useEffect(() => {
    // Obtener sesión inicial
    checkSession()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        
        // Ignorar eventos duplicados mientras se está verificando
        if (isCheckingSession.current) {
          console.log('Ya se está verificando la sesión, ignorando evento')
          return
        }
        
        if (session?.user) {
          await loadUserProfile(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setPerfil(null)
          setIsDirector(false)
          setLoading(false)
        }
      }
    )

    // Manejar visibilidad de la página (cuando cambias de ventana)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Página visible, verificando sesión...')
        
        // Debounce: esperar 500ms antes de verificar
        clearTimeout(sessionCheckTimeout.current)
        sessionCheckTimeout.current = setTimeout(() => {
          refreshSessionIfNeeded()
        }, 500)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearTimeout(sessionCheckTimeout.current)
    }
  }, [])

  const checkSession = async () => {
    // Prevenir múltiples verificaciones simultáneas
    if (isCheckingSession.current) {
      console.log('Ya hay una verificación en curso')
      return
    }

    isCheckingSession.current = true

    try {
      setLoading(true)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Error de sesión:', sessionError)
        throw sessionError
      }
      
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setLoading(false)
      }
    } catch (err) {
      console.error('Error al verificar sesión:', err)
      setError(err.message)
      setLoading(false)
    } finally {
      isCheckingSession.current = false
    }
  }

  const refreshSessionIfNeeded = async () => {
    // No intentar refrescar si ya se está verificando
    if (isCheckingSession.current) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        console.log('No hay sesión activa')
        return
      }

      // Verificar si el token está cerca de expirar (menos de 5 minutos)
      const expiresAt = session.expires_at
      const now = Math.floor(Date.now() / 1000)
      const timeUntilExpiry = expiresAt - now
      
      console.log(`Token expira en ${timeUntilExpiry} segundos`)

      if (timeUntilExpiry < 300) { // Menos de 5 minutos
        console.log('Token cerca de expirar, refrescando...')
        
        const { data: { session: refreshedSession }, error: refreshError } = 
          await supabase.auth.refreshSession()
        
        if (refreshError) {
          console.error('Error al refrescar sesión:', refreshError)
        } else if (refreshedSession?.user) {
          console.log('Sesión refrescada exitosamente')
          await loadUserProfile(refreshedSession.user)
        }
      } else {
        console.log('Token aún válido, no es necesario refrescar')
      }
    } catch (err) {
      console.error('Error al verificar/refrescar sesión:', err)
    }
  }

  const loadUserProfile = async (authUser) => {
    try {
      setUser(authUser)

      // Obtener perfil del usuario
      const { data: perfilData, error: perfilError } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', authUser.id)
        .eq('estado', 'ACTIVO')
        .single()

      if (perfilError) {
        console.error('Perfil no encontrado o inactivo')
        setPerfil(null)
        setIsDirector(false)
        setError('Usuario no autorizado para acceder al sistema')
      } else {
        setPerfil(perfilData)
        setIsDirector(perfilData.rol_principal === 'DIRECTOR')
        setError(null)
      }
    } catch (err) {
      console.error('Error al cargar perfil:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      return { success: true, data }
    } catch (err) {
      console.error('Error al iniciar sesión:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) throw signOutError

      setUser(null)
      setPerfil(null)
      setIsDirector(false)
      setError(null)

      return { success: true }
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    perfil,
    isDirector,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user && !!perfil,
    hasAccess: isDirector
  }
}
