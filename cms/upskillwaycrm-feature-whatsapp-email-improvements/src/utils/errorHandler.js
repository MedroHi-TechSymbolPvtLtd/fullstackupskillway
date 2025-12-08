// Global error handler for media and other errors

class ErrorHandler {
  constructor() {
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.warn('Unhandled promise rejection:', event.reason);
      
      // Handle specific media errors
      if (event.reason && event.reason.name === 'AbortError') {
        console.log('Media play request was interrupted - this is normal behavior');
        event.preventDefault(); // Prevent the error from being logged as unhandled
      }
    });

    // Handle general errors
    window.addEventListener('error', (event) => {
      console.warn('Global error caught:', event.error);
      
      // Handle media-related errors
      if (event.error && event.error.message && 
          event.error.message.includes('play()')) {
        console.log('Media play error caught and handled');
        event.preventDefault();
      }
    });
  }

  // Handle media errors specifically
  handleMediaError(error, context = 'Unknown') {
    console.group(`Media Error in ${context}`);
    
    if (error.name === 'AbortError') {
      console.log('✓ Play request interrupted - normal behavior');
    } else if (error.name === 'NotAllowedError') {
      console.log('✓ Play blocked by browser autoplay policy');
    } else if (error.name === 'NotSupportedError') {
      console.log('✓ Media format not supported');
    } else {
      console.error('✗ Unexpected media error:', error);
    }
    
    console.groupEnd();
  }

  // Safely execute async operations
  async safeAsync(asyncFn, context = 'Unknown') {
    try {
      return await asyncFn();
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`${context}: Operation was aborted - this is normal`);
      } else {
        console.error(`${context}: Error occurred:`, error);
      }
      return null;
    }
  }
}

// Create global instance
const errorHandler = new ErrorHandler();

export default errorHandler;