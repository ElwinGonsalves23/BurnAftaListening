import { useState, useEffect } from 'react'
import { supabase, Database } from '../lib/supabase'
import toast from 'react-hot-toast'

type Confession = Database['public']['Tables']['confessions']['Row']
type ConfessionInsert = Database['public']['Tables']['confessions']['Insert']

export function useConfessions() {
  const [confessions, setConfessions] = useState<Confession[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConfessions = async () => {
    try {
      // First, mark expired confessions as burned
      await supabase.rpc('mark_expired_confessions')
      
      // Then fetch active confessions
      const { data, error } = await supabase
        .from('confessions')
        .select('*')
        .eq('is_burned', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      setConfessions(data || [])
    } catch (error) {
      console.error('Error fetching confessions:', error)
      toast.error('Failed to load confessions')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserConfessions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('confessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user confessions:', error)
      toast.error('Failed to load your confessions')
      return []
    }
  }

  const createConfession = async (confession: ConfessionInsert) => {
    try {
      const { data, error } = await supabase
        .from('confessions')
        .insert(confession)
        .select()
        .single()

      if (error) throw error
      toast.success('Confession published!')
      return data
    } catch (error) {
      console.error('Error creating confession:', error)
      toast.error('Failed to publish confession')
      throw error
    }
  }

  const deleteConfession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('confessions')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Confession deleted')
      return true
    } catch (error) {
      console.error('Error deleting confession:', error)
      toast.error('Failed to delete confession')
      return false
    }
  }

  const incrementViewCount = async (id: string) => {
    try {
      // First, fetch the current view count
      const { data: confession, error: fetchError } = await supabase
        .from('confessions')
        .select('view_count')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Then update with the incremented value
      const newViewCount = (confession.view_count || 0) + 1
      const { error: updateError } = await supabase
        .from('confessions')
        .update({ view_count: newViewCount })
        .eq('id', id)

      if (updateError) throw updateError
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  useEffect(() => {
    fetchConfessions()
  }, [])

  return {
    confessions,
    loading,
    fetchConfessions,
    fetchUserConfessions,
    createConfession,
    deleteConfession,
    incrementViewCount,
  }
}