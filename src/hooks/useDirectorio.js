import { useState, useEffect, useCallback } from 'react'
import { directorioService } from '../services/directorioService'

/**
 * Hook personalizado para manejar operaciones del directorio
 */
export const useDirectorio = (filtrosIniciales = {}) => {
  const [entradas, setEntradas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filtros, setFiltros] = useState(filtrosIniciales)

  // Cargar entradas del directorio
  const cargarEntradas = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: loadError } = await directorioService.getAll(filtros)

      if (loadError) throw loadError

      setEntradas(data || [])
    } catch (err) {
      console.error('Error al cargar directorio:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  // Cargar al montar y cuando cambien los filtros
  useEffect(() => {
    cargarEntradas()
  }, [cargarEntradas])

  // Crear nueva entrada
  const crear = async (nuevaEntrada) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: createError } = await directorioService.create(nuevaEntrada)

      if (createError) throw createError

      // Actualizar lista local
      setEntradas(prev => [...prev, data])

      return { success: true, data }
    } catch (err) {
      console.error('Error al crear entrada:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Actualizar entrada existente
  const actualizar = async (id, datosActualizados) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: updateError } = await directorioService.update(id, datosActualizados)

      if (updateError) throw updateError

      // Actualizar lista local
      setEntradas(prev =>
        prev.map(entrada => entrada.id === id ? data : entrada)
      )

      return { success: true, data }
    } catch (err) {
      console.error('Error al actualizar entrada:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Eliminar entrada
  const eliminar = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await directorioService.delete(id)

      if (deleteError) throw deleteError

      // Remover de lista local
      setEntradas(prev => prev.filter(entrada => entrada.id !== id))

      return { success: true }
    } catch (err) {
      console.error('Error al eliminar entrada:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Actualizar filtros
  const actualizarFiltros = (nuevosFiltros) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }))
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({})
  }

  // Exportar a CSV
  const exportarCSV = async () => {
    try {
      const { data, error: exportError } = await directorioService.exportarCSV()

      if (exportError) throw exportError

      const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'directorio.csv'
      link.click()
      URL.revokeObjectURL(url)

      return { success: true }
    } catch (err) {
      console.error('Error al exportar CSV:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  return {
    entradas,
    loading,
    error,
    filtros,
    cargarEntradas,
    crear,
    actualizar,
    eliminar,
    actualizarFiltros,
    limpiarFiltros,
    exportarCSV
  }
}
