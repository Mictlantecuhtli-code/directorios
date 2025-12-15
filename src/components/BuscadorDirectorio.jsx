import { useState } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { useAreas } from '../hooks/useAreas'

export const BuscadorDirectorio = ({ onBuscar, onLimpiar, filtrosActuales = {} }) => {
  const [busqueda, setBusqueda] = useState(filtrosActuales.busqueda || '')
  const [areaSeleccionada, setAreaSeleccionada] = useState(filtrosActuales.area_id || '')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  
  const { areas } = useAreas()

  const handleSubmit = (e) => {
    e.preventDefault()
    onBuscar({
      busqueda: busqueda.trim(),
      area_id: areaSeleccionada !== '' ? Number(areaSeleccionada) : null
    })
  }

  const handleLimpiar = () => {
    setBusqueda('')
    setAreaSeleccionada('')
    onLimpiar()
  }

  const hayFiltrosActivos = busqueda || areaSeleccionada

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Búsqueda principal */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, puesto, departamento o email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`px-4 py-2 border rounded-md flex items-center gap-2 transition-colors ${
              mostrarFiltros || areaSeleccionada
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filtros</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>

          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={handleLimpiar}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          )}
        </div>

        {/* Filtros adicionales */}
        {mostrarFiltros && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filtro por área */}
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                  Área
                </label>
                <select
                  id="area"
                  value={areaSeleccionada}
                  onChange={(e) => {
                    const value = e.target.value
                    setAreaSeleccionada(value === '' ? '' : Number(value))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las áreas</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Indicador de filtros activos */}
      {hayFiltrosActivos && (
        <div className="flex flex-wrap gap-2">
          {busqueda && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Búsqueda: "{busqueda}"
            </span>
          )}
          {areaSeleccionada !== '' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Área: {areas.find(a => a.id === areaSeleccionada)?.nombre}
            </span>
          )}
        </div>
      )}
    </div>
  )
}