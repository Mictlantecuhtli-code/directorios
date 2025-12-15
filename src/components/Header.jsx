import { LogOut, User } from 'lucide-react'
import AifaLogo from '/assets/AIFA_logo.png'
import { useAuth } from '../hooks/useAuth'

export const Header = () => {
  const { perfil, signOut } = useAuth()

  const handleSignOut = async () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await signOut()
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <img
              src={AifaLogo}
              alt="Logo AIFA"
              className="h-10 w-auto object-contain"
            />
            <span className="sr-only">Directorio AIFA</span>
          </div>

          {/* Info de usuario */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-5 h-5 text-gray-400" />
              <div className="text-right hidden sm:block">
                <p className="font-medium text-gray-900">
                  {perfil?.nombre_completo || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500">
                  {perfil?.puesto || perfil?.rol_principal}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}	