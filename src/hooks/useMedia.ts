import { useState, useEffect } from 'react';

interface MediaItem {
  id: number;
  file_url: string;
  file_type: string;
  title: string;
  alt_text: string;
  content_type_name: string;
  created_at: string;
}

interface UseMediaOptions {
  contentType: string;
  objectId: number;
  enabled?: boolean;
}

export function useMedia({ contentType, objectId, enabled = true }: UseMediaOptions) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !contentType || !objectId) {
      return;
    }

    const fetchMedia = async () => {
      setLoading(true);
      setError(null);

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const url = `${API_BASE_URL}/media/for_object/?content_type=${contentType}&object_id=${objectId}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch media: ${response.statusText}`);
        }

        const data = await response.json();
        setMedia(data);
      } catch (err) {
        console.error('Error fetching media:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch media');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [contentType, objectId, enabled]);

  // Get the first/primary media item
  const primaryMedia = media.length > 0 ? media[0] : null;

  return {
    media,
    primaryMedia,
    loading,
    error,
    hasMedia: media.length > 0,
  };
}
