import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { apiRunner } from '@/lib/utils';
import { CSSLoader } from '@/components/CSSLoader';

interface DiscountPreview {
  name: string;
  percentage: number;
  description?: string;
  validTo: string;
}

interface DiscountsPreviewData {
  total_discounts: number;
  current_time: string;
  active_discounts: DiscountPreview[];
}

export const DiscountsPreview: React.FC = () => {
  const [data, setData] = useState<DiscountsPreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const subscription = apiRunner<DiscountsPreviewData>('http://localhost:8000/discounts-preview/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).subscribe({
      next: (data) => {
        setData(data);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message || 'Failed to fetch discounts preview');
        setLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p>Loading discounts preview...</p>
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

  if (!data) {
    return null;
  }

  return (
    <>
      <CSSLoader 
        cssUrl="http://localhost:8000/discounts-scoped.css"
        onLoad={() => console.log('Scoped CSS loaded successfully')}
        onError={(error) => console.error('Failed to load scoped CSS:', error)}
      />
      
      <div className="discounts-preview">
        <div className="header">
          <h2>Active Discounts</h2>
          <p>Discover amazing deals and special offers</p>
        </div>
        
        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">{data.total_discounts}</span> Active Discounts
          </div>
          <div className="stat-item">
            Last Updated: {data.current_time}
          </div>
        </div>

        {data.active_discounts.length > 0 ? (
          <div className="discounts-grid">
            {data.active_discounts.map((discount, index) => (
              <div key={index} className="discount-card">
                <h3 className="discount-name">{discount.name}</h3>
                <div className="discount-percentage">{discount.percentage}% OFF</div>
                
                {discount.description && (
                  <p className="discount-description">{discount.description}</p>
                )}
                
                <div className="discount-validity">
                  <div className="validity-label">Valid</div>
                  <div className="validity-date">{discount.validTo}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-discounts">
            <h3>No Active Discounts</h3>
            <p>There are currently no active discounts available. Check back later for new offers!</p>
          </div>
        )}
      </div>
    </>
  );
};
