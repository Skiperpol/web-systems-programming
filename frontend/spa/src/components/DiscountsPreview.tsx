import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { from } from 'rxjs';

export const DiscountsPreview: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [cssLoaded, setCssLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Load CSS first
    const cssSubscription = from(
      fetch('http://localhost:8000/discounts-scoped.css', {
        method: 'GET',
        headers: {
          'Accept': 'text/css',
        },
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`CSS server error: ${response.statusText}`);
        }
        return response.text();
      })
    ).subscribe({
      next: (cssContent) => {
        // Inject CSS into document head
        const styleElement = document.createElement('style');
        styleElement.textContent = cssContent;
        styleElement.setAttribute('data-css-url', 'discounts-scoped.css');
        document.head.appendChild(styleElement);
        setCssLoaded(true);
      },
      error: (err) => {
        console.error('Failed to load CSS:', err);
        setError(err.message || 'Failed to load styles');
        setLoading(false);
      },
    });

    // Load HTML content
    const htmlSubscription = from(
      fetch('http://localhost:8000/discounts/', {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTML server error: ${response.statusText}`);
        }
        return response.text();
      })
    ).subscribe({
      next: (html) => {
        setHtmlContent(html);
        // Only set loading to false when both CSS and HTML are loaded
        if (cssLoaded) {
          setLoading(false);
        }
      },
      error: (err) => {
        console.error('Failed to load HTML:', err);
        setError(err.message || 'Failed to fetch discounts template');
        setLoading(false);
      },
    });

    return () => {
      cssSubscription.unsubscribe();
      htmlSubscription.unsubscribe();
      // Clean up injected CSS when component unmounts
      const injectedStyle = document.querySelector('style[data-css-url="discounts-scoped.css"]');
      if (injectedStyle) {
        injectedStyle.remove();
      }
    };
  }, [cssLoaded]);

  // Set loading to false when CSS is loaded and we have HTML content
  useEffect(() => {
    if (cssLoaded && htmlContent && loading) {
      setLoading(false);
    }
  }, [cssLoaded, htmlContent, loading]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <p>Loading discounts preview...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-destructive">Error loading discounts: {error}</p>
        </CardContent>
      </Card>
    );
  }

  // Render the Django template HTML directly
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      className="discounts-preview-container"
    />
  );
};
