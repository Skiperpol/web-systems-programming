import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { Discount } from '../api/discountApi';

export interface DiscountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (discount: Omit<Discount, 'id'>) => void;
  discount?: Discount | null;
  title: string;
}

export const DiscountForm: React.FC<DiscountFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  discount,
  title,
}) => {
  const [formData, setFormData] = useState<Omit<Discount, 'id'>>({
    name: '',
    percentage: 0,
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (discount) {
      setFormData({
        name: discount.name,
        percentage: discount.percentage,
        description: discount.description,
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        percentage: 0,
        description: '',
      });
      setErrors({});
    }
  }, [discount]);

  const handleInputChange = (field: keyof Omit<Discount, 'id'>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'percentage' ? parseFloat(event.target.value) || 0 : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [field]: '',
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nazwa rabatu jest wymagana';
    }

    if (formData.percentage <= 0 || formData.percentage > 100) {
      newErrors.percentage = 'Procent rabatu musi być między 1 a 100';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Opis rabatu jest wymagany';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nazwa rabatu *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="Nazwa rabatu"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="percentage">Procent rabatu *</Label>
            <Input
              id="percentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.percentage}
              onChange={handleInputChange('percentage')}
              placeholder="0.00"
              className={errors.percentage ? 'border-destructive' : ''}
            />
            {errors.percentage && (
              <p className="text-sm text-destructive">{errors.percentage}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={handleInputChange('description')}
              placeholder="Opis rabatu"
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Zapisywanie...' : 'Zapisz'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
