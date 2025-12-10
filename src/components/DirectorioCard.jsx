import { Phone, Mail, MapPin, Building2, Briefcase, Edit, Trash2, User } from 'lucide-react'

export const DirectorioCard = ({ entrada, onEditar, onEliminar }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200">
      <div className="flex items-start gap-4">
        {/* Avatar o foto */}
        <div className="flex-shrink-0">
          {entrada.foto_url ? (
            <img
              src={entrada.foto_url}
              alt={entrada.nombre_completo}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
          )}
        </div>

        {/* Información */}
        <div className="flex-1 min-w-0">
          {/* Nombre y puesto */}
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {entrada.nombre_completo}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <Briefcase className="w-4 h-4" />
            {entrada.puesto}
          </p>

          {/* Área y departamento */}
          <div className="mt-2 space-y-1">
            {entrada.area && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {entrada.area.nombre}
              </p>
            )}
            {entrada.departamento && (
              <p className="text-sm text-gray-500">
                {entrada.departamento}
              </p>
            )}
          </div>

          {/* Información de contacto */}
          <div className="mt-3 space-y-1.5">
            {entrada.email && (
              <a
                href={`mailto:${entrada.email}`}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
                {entrada.email}
              </a>
            )}

            <div className="flex flex-wrap gap-4">
              {entrada.telefono && (
                <a
                  href={`tel:${entrada.telefono}`}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  <Phone className="w-4 h-4" />
                  {entrada.telefono}
                  {entrada.extension && ` ext. ${entrada.extension}`}
                </a>
              )}

              {entrada.celular && (
                <a
                  href={`tel:${entrada.celular}`}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  <Phone className="w-4 h-4" />
                  {entrada.celular} (cel)
                </a>
              )}
            </div>

            {entrada.ubicacion_oficina && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {entrada.ubicacion_oficina}
              </p>
            )}
          </div>

          {/* Notas */}
          {entrada.notas && (
            <p className="mt-3 text-sm text-gray-500 italic">
              {entrada.notas}
            </p>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onEditar(entrada)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Editar"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEliminar(entrada)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}