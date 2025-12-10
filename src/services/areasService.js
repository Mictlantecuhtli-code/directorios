import { supabase } from './supabase'

/**
 * Servicio para manejar operaciones relacionadas con áreas
 */
export const areasService = {
  /**
   * Obtener todas las áreas activas
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .eq('estado', 'ACTIVO')
        .order('orden_visualizacion', { ascending: true })
        .order('nombre', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al obtener áreas:', error)
      return { data: null, error }
    }
  },

  /**
   * Obtener un área por ID
   */
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al obtener área:', error)
      return { data: null, error }
    }
  },

  /**
   * Obtener áreas jerárquicas (con parent)
   */
  async getJerarquia() {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select(`
          *,
          parent:areas!areas_parent_area_id_fkey(id, nombre, clave)
        `)
        .eq('estado', 'ACTIVO')
        .order('nivel', { ascending: true })
        .order('orden_visualizacion', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al obtener jerarquía de áreas:', error)
      return { data: null, error }
    }
  }
}