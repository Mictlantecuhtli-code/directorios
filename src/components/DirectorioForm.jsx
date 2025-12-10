import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { useAreas } from '../hooks/useAreas'

export const DirectorioForm = ({ entrada = null, onGuardar, onCancelar, loading }) => {
  const { areas } = useAreas()
  const [formData, setFormData] = useState({
    nombre_completo: '',
    puesto: '',
    area_id: '',
    departamento: '',
    telefono: '',
    extension: '',
    email: '',
    celular: '',
    ubicacion_oficina: '',
    foto_url: '',
    notas: '',
    orden_visualizacion: 0
  })

  const [errores, setErrores] = useState({})

  useEffect(() => {
    if (entrada) {
      setFormData({
        nombre_completo: entrada.nombre_completo || '',
        puesto: entrada.puesto || '',
        area_id: entrada.area_id || '',
        departamento: entrada.departamento || '',
        telefono: entrada.telefono || '',
        extension: entrada.extension || '',
        email: entrada.email || '',
        celular: entrada.celular || '',
        ubicacion_oficina: entrada.ubicacion_oficina || '',
        foto_url: entrada.foto_url || '',
        notas: entrada.notas || '',
        orden_visualizacion: entrada.orden_visualizacion || 0
      })
    }
  }, [entrada])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error del campo al escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!formData.nombre_completo.trim()) {
      nuevosErrores.nombre_completo = 'El nombre completo es requerido'
    }

    if (!formData.puesto.trim()) {
      nuevosErrores.puesto = 'El puesto es requerido'
    }

    if (formData.email && !formData.email.endsWith('@aifa.aero')) {
      nuevosErrores.email = 'El email debe ser del dominio @aifa.aero'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    // Limpiar campos vacíos antes de enviar
    const datosLimpios = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== '')
    )

    onGuardar(datosLimpios)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {entrada ? 'Editar Entrada' : 'Nueva Entrada'}
          </h2>
          <button
            onClick={onCancelar}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errores.nombre_completo ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errores.nombre_completo && (
              <p className="text-sm text-red-600 mt-1">{errores.nombre_completo}</p>
            )}
          </div>

          {/* Puesto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puesto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="puesto"
              value={formData.puesto}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errores.puesto ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errores.puesto && (
              <p className="text-sm text-red-600 mt-1">{errores.puesto}</p>
            )}
          </div>

          {/* Área y Departamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Área
              </label>
              <select
                name="area_id"
                value={formData.area_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Seleccionar área</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nombre@aifa.aero"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errores.email ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errores.email && (
              <p className="text-sm text-red-600 mt-1">{errores.email}</p>
            )}
          </div>

          {/* Teléfonos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="5512345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extensión
              </label>
              <input
                type="text"
                name="extension"
                value={formData.extension}
                onChange={handleChange}
                placeholder="1234"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Celular
              </label>
              <input
                type="tel"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                placeholder="5512345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación de oficina
            </label>
            <input
              type="text"
              name="ubicacion_oficina"
              value={formData.ubicacion_oficina}
              onChange={handleChange}
              placeholder="Edificio A, Piso 2, Oficina 201"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* URL de foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de foto
            </label>
            <input
              type="url"
              name="foto_url"
              value={formData.foto_url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/foto.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Orden de visualización */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orden de visualización
            </label>
            <input
              type="number"
              name="orden_visualizacion"
              value={formData.orden_visualizacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Número menor aparece primero (0 = sin orden específico)
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancelar}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}