import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Home, Plus, User, LogOut, Flame } from 'lucide-react'
import toast from 'react-hot-toast'

export function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Failed to sign out')
    } else {
      toast.success('Signed out successfully')
      navigate('/login')
    }
  }

  if (!user) return null

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/feed" className="flex items-center space-x-2">
            <Flame className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold text-white">Burn After Listening</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/feed"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/feed')
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/create"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/create')
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/profile')
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}