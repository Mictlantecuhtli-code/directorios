import { useState, useEffect } from 'react'
import { areasService } from '../services/areasService'

/**
 * Hook para manejar operaciones con áreas
 */
export const useAreas = () => {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarAreas()
  }, [])

  const cargarAreas = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: loadError } = await areasService.getAll()
      
      if (loadError) throw loadError

      setAreas(data || [])
    } catch (err) {
      console.error('Error al cargar áreas:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    areas,
    loading,
    error,
    recargar: cargarAreas
  }
}