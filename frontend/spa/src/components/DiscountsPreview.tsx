import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiRunner } from '@/lib/utils';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Active Discounts</h2>
          <p className="text-muted-foreground">Discover amazing deals and special offers</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary">{data.total_discounts}</span>
          <span>Active Discounts</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Last Updated:</span>
          <span>{data.current_time}</span>
        </div>
      </div>

      {data.active_discounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.active_discounts.map((discount, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{discount.name}</CardTitle>
                  <Badge variant="destructive" className="ml-2">
                    {discount.percentage}% OFF
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {discount.description && (
                  <CardDescription className="mb-4">
                    {discount.description}
                  </CardDescription>
                )}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Valid Until
                  </div>
                  <div className="text-sm">
                    {discount.validTo}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-32 text-center">
            <h3 className="text-lg font-semibold mb-2">No Active Discounts</h3>
            <p className="text-muted-foreground">
              There are currently no active discounts available. Check back later for new offers!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
