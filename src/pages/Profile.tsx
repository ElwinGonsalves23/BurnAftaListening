import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useConfessions } from '../hooks/useConfessions'
import { CountdownTimer } from '../components/CountdownTimer'
import { User, Flame, Trash2, Eye } from 'lucide-react'
import { formatDistanceToNow, isPast } from 'date-fns'

export function Profile() {
  const { user } = useAuth()
  const { fetchUserConfessions, deleteConfession } = useConfessions()
  const [userConfessions, setUserConfessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    burned: 0,
    totalViews: 0
  })

  useEffect(() => {
    if (user) {
      loadUserConfessions()
    }
  }, [user])

  const loadUserConfessions = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const confessions = await fetchUserConfessions(user.id)
      setUserConfessions(confessions)
      
      // Calculate stats
      const active = confessions.filter(c => !isPast(new Date(c.burn_after)) && !c.is_burned)
      const burned = confessions.filter(c => isPast(new Date(c.burn_after)) || c.is_burned)
      const totalViews = confessions.reduce((sum, c) => sum + c.view_count, 0)
      
      setStats({
        total: confessions.length,
        active: active.length,
        burned: burned.length,
        totalViews
      })
    } catch (error) {
      console.error('Error loading user confessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this confession?')) {
      const success = await deleteConfession(id)
      if (success) {
        loadUserConfessions()
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-dark-800 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Your Profile</h1>
              <p className="text-dark-400">{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-dark-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-dark-400">Total Confessions</div>
            </div>
            <div className="bg-dark-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-400">{stats.active}</div>
              <div className="text-sm text-dark-400">Active</div>
            </div>
            <div className="bg-dark-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-dark-400">{stats.burned}</div>
              <div className="text-sm text-dark-400">Burned</div>
            </div>
            <div className="bg-dark-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalViews}</div>
              <div className="text-sm text-dark-400">Total Views</div>
            </div>
          </div>
        </div>

        {/* Confessions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Your Confessions</h2>
          
          {userConfessions.length === 0 ? (
            <div className="text-center py-12 bg-dark-800 rounded-lg">
              <Flame className="w-16 h-16 text-dark-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-400 mb-2">
                No confessions yet
              </h3>
              <p className="text-dark-500">
                Create your first confession to get started
              </p>
            </div>
          ) : (
            userConfessions.map((confession) => {
              const isExpired = isPast(new Date(confession.burn_after)) || confession.is_burned
              
              return (
                <div
                  key={confession.id}
                  className={`bg-dark-800 rounded-lg p-6 border border-dark-700 ${
                    isExpired ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {confession.title || 'Untitled Confession'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          confession.type === 'text' 
                            ? 'bg-blue-600 text-white'
                            : confession.type === 'audio'
                            ? 'bg-green-600 text-white'
                            : 'bg-purple-600 text-white'
                        }`}>
                          {confession.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-dark-400 mb-2">
                        <span>{formatDistanceToNow(new Date(confession.created_at))} ago</span>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{confession.view_count} views</span>
                        </div>
                      </div>

                      {confession.content && (
                        <p className="text-dark-300 text-sm mb-3">
                          {confession.content.length > 150 
                            ? `${confession.content.substring(0, 150)}...`
                            : confession.content
                          }
                        </p>
                      )}

                      {confession.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {confession.tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-dark-700 text-dark-300 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {!isExpired && (
                        <button
                          onClick={() => handleDelete(confession.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete confession"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {isExpired ? (
                        <div className="flex items-center space-x-1 text-dark-500">
                          <Flame className="w-4 h-4" />
                          <span className="text-sm">Burned</span>
                        </div>
                      ) : (
                        <CountdownTimer burnAfter={confession.burn_after} />
                      )}
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isExpired 
                        ? 'bg-dark-700 text-dark-400'
                        : 'bg-primary-600 text-white'
                    }`}>
                      {isExpired ? 'Burned' : 'Active'}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}