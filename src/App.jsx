import { useAuth } from './hooks/useAuth'
import { Login } from './components/Login'
import { Header } from './components/Header'
import { DirectorioLista } from './components/DirectorioLista'
import { Loading } from './components/Loading'
import { AlertCircle } from 'lucide-react'

function App() {
  const { isAuthenticated, hasAccess, loading, error } = useAuth()

  // Mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading mensaje="Verificando autenticación..." />
      </div>
    )
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <Login />
  }

  // Si está autenticado pero no tiene acceso (no es DIRECTOR)
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-6">
            Solo usuarios con rol de DIRECTOR pueden acceder a este sistema.
          </p>
          {error && (
            <p className="text-sm text-red-600 mb-4">
              {error}
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Usuario autenticado y con acceso
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DirectorioLista />
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} AIFA - Sistema de Directorio Institucional
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
