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

import type { Warehouse } from '../api/warehouseApi';

export interface WarehouseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (warehouse: Omit<Warehouse, 'id'>) => void;
  warehouse?: Warehouse | null;
  title: string;
}

export const WarehouseForm: React.FC<WarehouseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  warehouse,
  title,
}) => {
  const [formData, setFormData] = useState<Omit<Warehouse, 'id'>>({
    name: '',
    address: '',
    capacity: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name,
        address: warehouse.address,
        capacity: warehouse.capacity,
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        address: '',
        capacity: 0,
      });
      setErrors({});
    }
  }, [warehouse]);

  const handleInputChange = (field: keyof Omit<Warehouse, 'id'>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'capacity' ? parseInt(event.target.value) || 0 : event.target.value;
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
      newErrors.name = 'Nazwa magazynu jest wymagana';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Adres magazynu jest wymagany';
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = 'Pojemność musi być większa od 0';
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
            <Label htmlFor="name">Nazwa magazynu *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="Nazwa magazynu"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adres *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleInputChange('address')}
              placeholder="Adres magazynu"
              className={errors.address ? 'border-destructive' : ''}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Pojemność (m²) *</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={handleInputChange('capacity')}
              placeholder="0"
              className={errors.capacity ? 'border-destructive' : ''}
            />
            {errors.capacity && (
              <p className="text-sm text-destructive">{errors.capacity}</p>
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
