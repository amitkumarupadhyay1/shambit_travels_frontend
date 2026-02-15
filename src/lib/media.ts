/**
 * Media Library API Service
 * Handles all media-related API calls
 * 
 * NOTE: Upload functionality is ADMIN-ONLY
 * Customers cannot upload media from frontend (per requirement #14)
 */

// Smart API URL detection for mobile compatibility
const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
  }
  
  if (typeof window === 'undefined') {
    return 'http://localhost:8000';
  }
  
  const hostname = window.location.hostname;
  
  if (hostname.includes('railway.app') || hostname.includes('vercel.app')) {
    return 'https://shambit.up.railway.app';
  }
  
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return `http://${hostname}:8000`;
  }
  
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

export interface Media {
  id: number;
  file_url: string;
  file_type: 'image' | 'video' | 'document' | 'other';
  title: string;
  alt_text: string;
  content_type_name: string;
  created_at: string;
  file_size?: number;
  image_dimensions?: {
    width: number;
    height: number;
  };
}

export interface MediaGalleryResponse {
  media: Media[];
  total_count: number;
  page_count: number;
  current_page: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface MediaStats {
  total_files: number;
  total_size: number;
  by_type: {
    images: number;
    videos: number;
    documents: number;
    other: number;
  };
  by_content_type: Array<{
    content_type__app_label: string;
    content_type__model: string;
    count: number;
  }>;
  recent_uploads: number;
}

/**
 * Get media for a specific object (City, Package, Experience, Article)
 * 
 * @param contentType - Format: "app_label.model" (e.g., "cities.city", "packages.package")
 * @param objectId - ID of the object
 * @returns Promise<Media[]>
 */
export async function getMediaForObject(
  contentType: string,
  objectId: number
): Promise<Media[]> {
  try {
    const contentTypeParam = encodeURIComponent(contentType);
    const objectIdParam = encodeURIComponent(String(objectId));
    const response = await fetch(
      `${API_BASE_URL}/api/media/for_object/?content_type=${contentTypeParam}&object_id=${objectIdParam}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Always fetch fresh data
      }
    );
    
    if (!response.ok) {
      console.error(`Failed to fetch media: ${response.status} ${response.statusText}`);
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching media for object:', error);
    return [];
  }
}

/**
 * Get thumbnail URL for an image
 * 
 * @param mediaId - Media ID
 * @param size - Size format "WIDTHxHEIGHT" (e.g., "300x200")
 * @returns string - Thumbnail URL
 */
export function getThumbnailUrl(mediaId: number, size: string = '300x200'): string {
  return `${API_BASE_URL}/api/media/${mediaId}/thumbnail/?size=${size}`;
}

/**
 * Get media gallery with pagination
 * 
 * @param page - Page number (default: 1)
 * @param pageSize - Items per page (default: 20)
 * @returns Promise<MediaGalleryResponse>
 */
export async function getMediaGallery(
  page: number = 1,
  pageSize: number = 20
): Promise<MediaGalleryResponse | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/media/gallery/?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );
    
    if (!response.ok) {
      console.error(`Failed to fetch media gallery: ${response.status}`);
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching media gallery:', error);
    return null;
  }
}

/**
 * Get media statistics
 * 
 * @returns Promise<MediaStats | null>
 */
export async function getMediaStats(): Promise<MediaStats | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/media/stats/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch media stats: ${response.status}`);
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching media stats:', error);
    return null;
  }
}

/**
 * Search media files
 * 
 * @param query - Search query
 * @param filters - Optional filters (file_type, content_type, date_from, date_to)
 * @returns Promise<Media[]>
 */
export async function searchMedia(
  query: string,
  filters?: {
    file_type?: 'image' | 'video' | 'document' | 'other';
    content_type?: string;
    date_from?: string;
    date_to?: string;
  }
): Promise<Media[]> {
  try {
    const searchData = {
      query,
      ...filters,
    };
    
    const response = await fetch(`${API_BASE_URL}/api/media/search/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchData),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`Failed to search media: ${response.status}`);
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('Error searching media:', error);
    return [];
  }
}

/**
 * Get recent media uploads
 * 
 * @param days - Number of days to look back (default: 7)
 * @returns Promise<Media[]>
 */
export async function getRecentMedia(days: number = 7): Promise<Media[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/media/recent/?days=${days}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );
    
    if (!response.ok) {
      console.error(`Failed to fetch recent media: ${response.status}`);
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching recent media:', error);
    return [];
  }
}

/**
 * Check media storage health
 * 
 * @returns Promise<object | null>
 */
export async function checkMediaHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/media/health/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`Media health check failed: ${response.status}`);
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error checking media health:', error);
    return null;
  }
}

/**
 * Delete a media file (ADMIN ONLY)
 * Requires authentication token
 * 
 * @param mediaId - ID of the media to delete
 * @param token - JWT authentication token
 * @returns Promise<{success: boolean, message?: string, error?: string}>
 */
export async function deleteMedia(
  mediaId: number,
  token: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/media/${mediaId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Failed to delete media: ${response.status}`, errorData);
      return {
        success: false,
        error: errorData.detail || errorData.error || `Failed to delete media: ${response.status}`,
      };
    }
    
    // 204 No Content doesn't have a body, but our custom response does
    const data = await response.json().catch(() => ({ message: 'Media deleted successfully' }));
    
    return {
      success: true,
      message: data.message || 'Media deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting media:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update media metadata (ADMIN ONLY)
 * Requires authentication token
 * 
 * @param mediaId - ID of the media to update
 * @param data - Updated metadata (title, alt_text)
 * @param token - JWT authentication token
 * @returns Promise<Media | null>
 */
export async function updateMedia(
  mediaId: number,
  data: { title?: string; alt_text?: string },
  token: string
): Promise<Media | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/media/${mediaId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      console.error(`Failed to update media: ${response.status}`);
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error updating media:', error);
    return null;
  }
}

/**
 * Upload a new media file (ADMIN ONLY)
 * Requires authentication token
 * 
 * @param file - File to upload
 * @param metadata - Optional metadata (title, alt_text, content_type, object_id)
 * @param token - JWT authentication token
 * @returns Promise<Media | null>
 */
export async function uploadMedia(
  file: File,
  metadata: {
    title?: string;
    alt_text?: string;
    content_type?: string;
    object_id?: number;
  },
  token: string
): Promise<Media | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata.title) formData.append('title', metadata.title);
    if (metadata.alt_text) formData.append('alt_text', metadata.alt_text);
    if (metadata.content_type) formData.append('content_type', metadata.content_type);
    if (metadata.object_id) formData.append('object_id', String(metadata.object_id));
    
    const response = await fetch(`${API_BASE_URL}/api/media/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Failed to upload media: ${response.status}`, errorData);
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error uploading media:', error);
    return null;
  }
}

/**
 * Helper function to get optimized image URL
 * For Cloudinary URLs, this adds optimization parameters
 * 
 * @param url - Original image URL
 * @param width - Desired width
 * @param height - Desired height
 * @returns string - Optimized URL
 */
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  height?: number
): string {
  // If it's a Cloudinary URL, we can add transformation parameters
  if (url.includes('cloudinary.com')) {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transformations = [];
      
      if (width) transformations.push(`w_${width}`);
      if (height) transformations.push(`h_${height}`);
      
      // Add optimization parameters
      transformations.push('q_auto:low'); // Auto quality
      transformations.push('f_auto'); // Auto format (WebP when supported)
      transformations.push('fl_lossy'); // Lossy compression
      
      const transformationString = transformations.join(',');
      return `${parts[0]}/upload/${transformationString}/${parts[1]}`;
    }
  }
  
  // Return original URL if not Cloudinary or transformation failed
  return url;
}

/**
 * Helper function to format file size
 * 
 * @param bytes - File size in bytes
 * @returns string - Formatted file size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
