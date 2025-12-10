import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
/**
 * Hook personalizado para manejar autenticación y permisos
 */
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [isDirector, setIsDirector] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Obtener sesión inicial
    checkSession()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        if (session?.user) {
          await loadUserProfile(session.user)
        } else {
          setUser(null)
          setPerfil(null)
          setIsDirector(false)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

const checkSession = async () => {
  try {
    setLoading(true)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Error de sesión:', sessionError)
      // Intentar refrescar la sesión
      const { data: { session: refreshedSession }, error: refreshError } = 
        await supabase.auth.refreshSession()
      
      if (refreshError) {
        throw refreshError
      }
      
      if (refreshedSession?.user) {
        await loadUserProfile(refreshedSession.user)
      } else {
        setLoading(false)
      }
    } else if (session?.user) {
      await loadUserProfile(session.user)
    } else {
      setLoading(false)
    }
  } catch (err) {
    console.error('Error al verificar sesión:', err)
    setError(err.message)
    setLoading(false)
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
        // Si no existe el perfil, el usuario no tiene acceso
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
