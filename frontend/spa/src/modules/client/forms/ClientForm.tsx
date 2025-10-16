import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  client?: Client | null;
  title: string;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  client,
  title,
}) => {
  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        postalCode: client.postalCode,
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
      });
      setErrors({});
    }
  }, [client]);

  const handleInputChange = (field: keyof Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    setErrors(prev => ({
      ...prev,
      [field]: '',
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nazwa jest wymagana';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon jest wymagany';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Adres jest wymagany';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Miasto jest wymagane';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Kod pocztowy jest wymagany';
    } else if (!/^\d{2}-\d{3}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Nieprawidłowy format kodu pocztowego (XX-XXX)';
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
      onClose();
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nazwa *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  placeholder="Nazwa klienta"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="email@example.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                placeholder="+48 123 456 789"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adres *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={handleInputChange('address')}
                placeholder="ul. Przykładowa 123"
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Miasto *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange('city')}
                  placeholder="Warszawa"
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Kod pocztowy *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange('postalCode')}
                  placeholder="00-000"
                  className={errors.postalCode ? 'border-destructive' : ''}
                />
                {errors.postalCode && (
                  <p className="text-sm text-destructive">{errors.postalCode}</p>
                )}
              </div>
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
