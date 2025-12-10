import { supabase } from './supabase'

/**
 * Servicio para manejar todas las operaciones del directorio
 */
export const directorioService = {
  /**
   * Obtener todas las entradas del directorio activas
   */
  async getAll(filtros = {}) {
    try {
      let query = supabase
        .from('directorio')
        .select(`
          *,
          area:areas(id, nombre, clave),
          creador:perfiles!directorio_creado_por_fkey(nombre_completo),
          editor:perfiles!directorio_editado_por_fkey(nombre_completo)
        `)
        .eq('estado', 'ACTIVO')
        .order('orden_visualizacion', { ascending: true })
        .order('nombre_completo', { ascending: true })

      // Aplicar filtros si existen
      if (filtros.busqueda) {
        query = query.or(`nombre_completo.ilike.%${filtros.busqueda}%,puesto.ilike.%${filtros.busqueda}%,departamento.ilike.%${filtros.busqueda}%,email.ilike.%${filtros.busqueda}%`)
      }

      if (filtros.area_id) {
        query = query.eq('area_id', filtros.area_id)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al obtener directorio:', error)
      return { data: null, error }
    }
  },

  /**
   * Obtener una entrada por ID
   */
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('directorio')
        .select(`
          *,
          area:areas(id, nombre, clave)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al obtener entrada:', error)
      return { data: null, error }
    }
  },

  /**
   * Crear nueva entrada en el directorio
   */
  async create(entrada) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      const { data, error } = await supabase
        .from('directorio')
        .insert([{
          ...entrada,
          creado_por: user.id,
          estado: 'ACTIVO'
        }])
        .select(`
          *,
          area:areas(id, nombre, clave)
        `)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al crear entrada:', error)
      return { data: null, error }
    }
  },

  /**
   * Actualizar entrada existente
   */
  async update(id, entrada) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      const { data, error } = await supabase
        .from('directorio')
        .update({
          ...entrada,
          editado_por: user.id
        })
        .eq('id', id)
        .select(`
          *,
          area:areas(id, nombre, clave)
        `)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al actualizar entrada:', error)
      return { data: null, error }
    }
  },

  /**
   * Eliminar entrada (soft delete - cambiar estado a INACTIVO)
   */
  async delete(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      const { data, error } = await supabase
        .from('directorio')
        .update({
          estado: 'INACTIVO',
          editado_por: user.id
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error al eliminar entrada:', error)
      return { data: null, error }
    }
  },

  /**
   * Búsqueda avanzada usando la función SQL
   */
  async buscarAvanzado(termino = '', area_id = null) {
    try {
      const { data, error } = await supabase
        .rpc('buscar_directorio', {
          p_termino: termino || null,
          p_area_id: area_id || null,
          p_estado: 'ACTIVO'
        })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error en búsqueda avanzada:', error)
      return { data: null, error }
    }
  },

  /**
   * Exportar a CSV
   */
  async exportarCSV() {
    try {
      const { data, error } = await this.getAll()
      
      if (error) throw error

      const csvContent = this.convertirACSV(data)
      return { data: csvContent, error: null }
    } catch (error) {
      console.error('Error al exportar CSV:', error)
      return { data: null, error }
    }
  },

  /**
   * Convertir datos a formato CSV
   */
  convertirACSV(datos) {
    if (!datos || datos.length === 0) return ''

    const headers = [
      'Nombre Completo',
      'Puesto',
      'Área',
      'Departamento',
      'Teléfono',
      'Extensión',
      'Email',
      'Celular',
      'Ubicación'
    ]

    const rows = datos.map(item => [
      item.nombre_completo,
      item.puesto,
      item.area?.nombre || '',
      item.departamento || '',
      item.telefono || '',
      item.extension || '',
      item.email || '',
      item.celular || '',
      item.ubicacion_oficina || ''
    ])

    const csvRows = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ]

    return csvRows.join('\n')
  }
}