import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

/**
 * VERSIÓN ULTRA-SIMPLIFICADA PARA DIAGNÓSTICO
 * Esta versión elimina TODOS los listeners innecesarios
 */
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [isDirector, setIsDirector] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Solo verificar sesión UNA VEZ al montar
    checkSession()
    
    // NO escuchamos onAuthStateChange
    // Esto elimina el 90% de los problemas
  }, []) // Array vacío = solo se ejecuta una vez

  const checkSession = async () => {
    try {
      console.log('🔍 Verificando sesión...')
      setLoading(true)
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('❌ Error de sesión:', sessionError)
        throw sessionError
      }
      
      if (session?.user) {
        console.log('✅ Sesión encontrada')
        await loadUserProfile(session.user)
      } else {
        console.log('⚠️ No hay sesión')
        setLoading(false)
      }
    } catch (err) {
      console.error('💥 Error en checkSession:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const loadUserProfile = async (authUser) => {
    try {
      console.log('👤 Cargando perfil...')
      setUser(authUser)

      const { data: perfilData, error: perfilError } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', authUser.id)
        .eq('estado', 'ACTIVO')
        .single()

      if (perfilError) {
        console.error('❌ Perfil no encontrado')
        setPerfil(null)
        setIsDirector(false)
        setError('Usuario no autorizado para acceder al sistema')
      } else {
        console.log('✅ Perfil cargado:', perfilData.nombre_completo)
        setPerfil(perfilData)
        setIsDirector(perfilData.rol_principal === 'DIRECTOR')
        setError(null)
      }
    } catch (err) {
      console.error('💥 Error al cargar perfil:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      console.log('🔐 Iniciando sesión...')
      setLoading(true)
      setError(null)

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      console.log('✅ Login exitoso')
      
      // Cargar perfil manualmente después del login
      if (data.user) {
        await loadUserProfile(data.user)
      }

      return { success: true, data }
    } catch (err) {
      console.error('❌ Error al iniciar sesión:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      console.log('👋 Cerrando sesión...')
      setLoading(true)
      
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) throw signOutError

      setUser(null)
      setPerfil(null)
      setIsDirector(false)
      setError(null)

      console.log('✅ Sesión cerrada')
      return { success: true }
    } catch (err) {
      console.error('❌ Error al cerrar sesión:', err)
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
