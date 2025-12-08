// Media utilities to handle video/audio safely

export const mediaUtils = {
  // Safely handle media play requests
  safePlay: async (mediaElement) => {
    if (!mediaElement || typeof mediaElement.play !== 'function') {
      return false;
    }

    try {
      const playPromise = mediaElement.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        return true;
      }
    } catch (error) {
      console.warn('Media play interrupted or failed:', error);
      
      // Handle specific AbortError
      if (error.name === 'AbortError') {
        console.log('Play request was interrupted - this is normal behavior');
      } else if (error.name === 'NotAllowedError') {
        console.log('Play request was prevented by browser autoplay policy');
      } else {
        console.error('Unexpected media error:', error);
      }
      
      return false;
    }
  },

  // Safely pause media
  safePause: (mediaElement) => {
    if (!mediaElement || typeof mediaElement.pause !== 'function') {
      return;
    }

    try {
      mediaElement.pause();
    } catch (error) {
      console.warn('Media pause failed:', error);
    }
  },

  // Check if media can autoplay
  canAutoplay: () => {
    // Most browsers now block autoplay by default
    return false;
  },

  // Extract YouTube video ID safely
  extractYouTubeId: (url) => {
    if (!url || typeof url !== 'string') {
      return null;
    }

    try {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
    } catch (error) {
      console.warn('Error extracting YouTube ID:', error);
    }

    return null;
  },

  // Get YouTube thumbnail safely
  getYouTubeThumbnail: (url, quality = 'mqdefault') => {
    const videoId = mediaUtils.extractYouTubeId(url);
    
    if (!videoId) {
      return 'https://via.placeholder.com/320x180/3b82f6/ffffff?text=Video';
    }

    const qualities = {
      'default': 'default',
      'medium': 'mqdefault', 
      'high': 'hqdefault',
      'standard': 'sddefault',
      'maxres': 'maxresdefault'
    };

    const selectedQuality = qualities[quality] || 'mqdefault';
    return `https://img.youtube.com/vi/${videoId}/${selectedQuality}.jpg`;
  },

  // Prevent media conflicts during component updates
  pauseAllMedia: () => {
    try {
      // Pause all video elements
      const videos = document.querySelectorAll('video');
      videos.forEach(video => mediaUtils.safePause(video));

      // Pause all audio elements
      const audios = document.querySelectorAll('audio');
      audios.forEach(audio => mediaUtils.safePause(audio));
    } catch (error) {
      console.warn('Error pausing media elements:', error);
    }
  }
};

export default mediaUtils;