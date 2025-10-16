import React, { useEffect } from 'react';
import { from } from 'rxjs';

interface CSSLoaderProps {
  cssUrl: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export const CSSLoader: React.FC<CSSLoaderProps> = ({ cssUrl, onLoad, onError }) => {

  useEffect(() => {
    // Check if CSS is already loaded
    const existingLink = document.querySelector(`link[href="${cssUrl}"]`);
    if (existingLink) {
      onLoad?.();
      return;
    }

    // Use direct fetch for CSS since apiRunner expects JSON
    const subscription = from(
      fetch(cssUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/css',
        },
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
        return response.text(); // Use text() instead of json()
      })
    ).subscribe({
      next: (cssContent) => {
        // Create a style element and inject the CSS
        const styleElement = document.createElement('style');
        styleElement.textContent = cssContent;
        styleElement.setAttribute('data-css-url', cssUrl);
        document.head.appendChild(styleElement);
        
        onLoad?.();
      },
      error: (err) => {
        const errorMessage = err.message || 'Failed to load CSS';
        onError?.(errorMessage);
      },
    });

    return () => subscription.unsubscribe();
  }, [cssUrl, onLoad, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const styleElement = document.querySelector(`style[data-css-url="${cssUrl}"]`);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [cssUrl]);

  return null; // This component doesn't render anything
};
