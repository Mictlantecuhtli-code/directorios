import { Loader2 } from 'lucide-react'

export const Loading = ({ mensaje = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
      <p className="text-sm text-gray-600">{mensaje}</p>
    </div>
  )
}