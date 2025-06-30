import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ReactionBarProps {
  confessionId: string;
  className?: string;
}

const AVAILABLE_EMOJIS = ['😱', '💔', '😭', '😤', '🤯', '❤️', '😂', '🙏'];

export function ReactionBar({ confessionId, className = '' }: ReactionBarProps) {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<Record<string, { count: number; userReacted: boolean }>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReactions();
  }, [confessionId]);

  const fetchReactions = async () => {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('emoji, user_id')
        .eq('confession_id', confessionId);

      if (error) throw error;

      // Group reactions by emoji
      const reactionCounts: Record<string, { count: number; userReacted: boolean }> = {};
      
      data?.forEach((reaction) => {
        if (!reactionCounts[reaction.emoji]) {
          reactionCounts[reaction.emoji] = { count: 0, userReacted: false };
        }
        reactionCounts[reaction.emoji].count++;
        if (user && reaction.user_id === user.id) {
          reactionCounts[reaction.emoji].userReacted = true;
        }
      });

      setReactions(reactionCounts);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  const toggleReaction = async (emoji: string) => {
    if (!user || loading) return;

    setLoading(true);
    try {
      const userReacted = reactions[emoji]?.userReacted;

      if (userReacted) {
        // Remove reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('confession_id', confessionId)
          .eq('user_id', user.id)
          .eq('emoji', emoji);

        if (error) throw error;
      } else {
        // Add reaction
        const { error } = await supabase
          .from('reactions')
          .insert({
            confession_id: confessionId,
            user_id: user.id,
            emoji,
          });

        if (error) throw error;
      }

      // Refresh reactions
      await fetchReactions();
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast.error('Failed to update reaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {AVAILABLE_EMOJIS.map((emoji) => {
        const reactionData = reactions[emoji];
        const count = reactionData?.count || 0;
        const userReacted = reactionData?.userReacted || false;

        return (
          <button
            key={emoji}
            onClick={() => toggleReaction(emoji)}
            disabled={loading}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-all duration-200 ${
              userReacted
                ? 'bg-primary-600 text-white shadow-lg scale-105'
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            <span className="text-base">{emoji}</span>
            {count > 0 && (
              <span className="text-xs font-medium min-w-[1rem] text-center">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}