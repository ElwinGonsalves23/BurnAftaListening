import { useState, useRef, useCallback } from 'react';
import { createNarration } from '../services/elevenlabs';
import toast from 'react-hot-toast';

export function useNarration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopCurrentAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const generateAndPlayNarration = useCallback(async (title: string | null, content: string | null) => {
    if (isGenerating) return;

    // Stop any currently playing audio
    stopCurrentAudio();

    setIsGenerating(true);

    try {
      const audioBlob = await createNarration(title, content);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      });

      audio.addEventListener('error', () => {
        setIsPlaying(false);
        toast.error('Error playing narration');
        URL.revokeObjectURL(audioUrl);
      });

      await audio.play();
      setIsPlaying(true);
      toast.success('Narration started');
    } catch (error) {
      console.error('Error generating narration:', error);
      toast.error('Failed to generate narration');
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, stopCurrentAudio]);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return {
    isGenerating,
    isPlaying,
    generateAndPlayNarration,
    togglePlayback,
    stopCurrentAudio,
  };
}