import { useEffect } from 'react'
import { useConfessions } from '../hooks/useConfessions'
import { ConfessionCard } from '../components/ConfessionCard'
import { Loader2, Flame } from 'lucide-react'

export function Feed() {
  const { confessions, loading, fetchConfessions, incrementViewCount } = useConfessions()

  useEffect(() => {
    // Refresh confessions every 30 seconds to check for burned ones
    const interval = setInterval(fetchConfessions, 30000)
    return () => clearInterval(interval)
  }, [fetchConfessions])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Flame className="w-8 h-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-white">Confession Feed</h1>
          </div>
          <p className="text-dark-400">
            Anonymous confessions that burn after time expires
          </p>
        </div>

        {confessions.length === 0 ? (
          <div className="text-center py-12">
            <Flame className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark-400 mb-2">
              No active confessions
            </h3>
            <p className="text-dark-500">
              Be the first to share your story
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {confessions.map((confession) => (
              <ConfessionCard
                key={confession.id}
                confession={confession}
                onView={incrementViewCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}