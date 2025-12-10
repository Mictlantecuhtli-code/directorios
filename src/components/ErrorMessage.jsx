import { AlertCircle, XCircle } from 'lucide-react'

export const ErrorMessage = ({ mensaje, onDismiss }) => {
  if (!mensaje) return null

  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-800">{mensaje}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800"
        >
          <XCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}