import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    perfil: null,
    isDirector: false,
    loading: true,
    error: null
  })

  const loadUserProfile = useCallback(async (authUser) => {
    try {
      const { data: perfilData, error: perfilError } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', authUser.id)
        .eq('estado', 'ACTIVO')
        .single()

      if (perfilError) {
        console.error('❌ Error al cargar perfil:', perfilError)
        setAuthState({
          user: authUser,
          perfil: null,
          isDirector: false,
          loading: false,
          error: 'Usuario no autorizado para acceder al sistema'
        })
      } else {
        const isDir = perfilData.rol_principal === 'DIRECTOR'

        setAuthState({
          user: authUser,
          perfil: perfilData,
          isDirector: isDir,
          loading: false,
          error: null
        })
      }
    } catch (err) {
      console.error('💥 Error al cargar perfil:', err)
      setAuthState(prev => ({
        ...prev,
        error: err.message,
        loading: false
      }))
    }
  }, [])

  const checkSession = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('❌ Error de sesión:', sessionError)
        throw sessionError
      }

      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    } catch (err) {
      console.error('💥 Error en checkSession:', err)
      setAuthState(prev => ({
        ...prev,
        error: err.message,
        loading: false
      }))
    }
  }, [loadUserProfile])

  const signIn = useCallback(async (email, password) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        console.error('❌ Error de login:', signInError)
        throw signInError
      }

      if (data.user) {
        await loadUserProfile(data.user)
      }

      return { success: true, data }
    } catch (err) {
      console.error('❌ Error al iniciar sesión:', err)
      setAuthState(prev => ({
        ...prev,
        error: err.message,
        loading: false
      }))
      return { success: false, error: err.message }
    }
  }, [loadUserProfile])

  const signOut = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))

      await supabase.auth.signOut()

      setAuthState({
        user: null,
        perfil: null,
        isDirector: false,
        loading: false,
        error: null
      })
      return { success: true }
    } catch (err) {
      console.error('❌ Error al cerrar sesión:', err)
      setAuthState(prev => ({
        ...prev,
        error: err.message,
        loading: false
      }))
      return { success: false, error: err.message }
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setAuthState(prev => ({ ...prev, user: null, perfil: null, isDirector: false, loading: false }))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [loadUserProfile])

  useEffect(() => {
  }, [authState])

  const value = useMemo(() => ({
    user: authState.user,
    perfil: authState.perfil,
    isDirector: authState.isDirector,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signOut,
    isAuthenticated: !!(authState.user && authState.perfil),
    hasAccess: authState.isDirector
  }), [authState, signIn, signOut])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }

  return context
}
