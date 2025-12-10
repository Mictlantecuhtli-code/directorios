import { useState } from 'react'
import { Plus, Download, Users, AlertCircle } from 'lucide-react'
import { useDirectorio } from '../hooks/useDirectorio'
import { BuscadorDirectorio } from './BuscadorDirectorio'
import { DirectorioCard } from './DirectorioCard'
import { DirectorioForm } from './DirectorioForm'
import { Loading } from './Loading'
import { ErrorMessage } from './ErrorMessage'

export const DirectorioLista = () => {
  const {
    entradas,
    loading,
    error,
    filtros,
    crear,
    actualizar,
    eliminar,
    actualizarFiltros,
    limpiarFiltros,
    recargar,
    exportarCSV
  } = useDirectorio()

  const [mostrarForm, setMostrarForm] = useState(false)
  const [entradaEditar, setEntradaEditar] = useState(null)
  const [loadingForm, setLoadingForm] = useState(false)

  const handleNuevo = () => {
    setEntradaEditar(null)
    setMostrarForm(true)
  }

  const handleEditar = (entrada) => {
    setEntradaEditar(entrada)
    setMostrarForm(true)
  }

  const handleEliminar = async (entrada) => {
    if (!confirm(`¿Estás seguro de eliminar a ${entrada.nombre_completo}?`)) {
      return
    }

    const result = await eliminar(entrada.id)
    
    if (result.success) {
      alert('Entrada eliminada correctamente')
    } else {
      alert(`Error al eliminar: ${result.error}`)
    }
  }

  const handleGuardar = async (datos) => {
    setLoadingForm(true)

    let result
    if (entradaEditar) {
      result = await actualizar(entradaEditar.id, datos)
    } else {
      result = await crear(datos)
    }

    setLoadingForm(false)

    if (result.success) {
      setMostrarForm(false)
      setEntradaEditar(null)
      alert(entradaEditar ? 'Entrada actualizada correctamente' : 'Entrada creada correctamente')
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  const handleCancelar = () => {
    setMostrarForm(false)
    setEntradaEditar(null)
  }

  const handleBuscar = (nuevosFiltros) => {
    actualizarFiltros(nuevosFiltros)
  }

  const handleExportar = async () => {
    const result = await exportarCSV()
    if (!result.success) {
      alert(`Error al exportar: ${result.error}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Directorio</h2>
          <p className="text-sm text-gray-600 mt-1">
            {entradas.length} {entradas.length === 1 ? 'entrada' : 'entradas'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportar}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>

          <button
            onClick={handleNuevo}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Entrada
          </button>
        </div>
      </div>

      {/* Buscador */}
      <BuscadorDirectorio
        onBuscar={handleBuscar}
        onLimpiar={limpiarFiltros}
        filtrosActuales={filtros}
      />

      {/* Mensajes de error */}
      {error && <ErrorMessage mensaje={error} />}

      {/* Loading */}
      {loading && <Loading mensaje="Cargando directorio..." />}

      {/* Lista de entradas */}
      {!loading && entradas.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay entradas en el directorio
          </h3>
          <p className="text-gray-600 mb-6">
            {filtros.busqueda || filtros.area_id
              ? 'No se encontraron resultados con los filtros actuales'
              : 'Comienza agregando la primera entrada'}
          </p>
          {!filtros.busqueda && !filtros.area_id && (
            <button
              onClick={handleNuevo}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar Primera Entrada
            </button>
          )}
        </div>
      )}

      {!loading && entradas.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {entradas.map(entrada => (
            <DirectorioCard
              key={entrada.id}
              entrada={entrada}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
            />
          ))}
        </div>
      )}

      {/* Modal del formulario */}
      {mostrarForm && (
        <DirectorioForm
          entrada={entradaEditar}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
          loading={loadingForm}
        />
      )}
    </div>
  )
}