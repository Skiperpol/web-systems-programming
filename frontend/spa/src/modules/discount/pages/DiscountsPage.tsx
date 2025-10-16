import React from 'react';
import { DataTable, type TableColumn, type TableConfig } from '@/components/data-table';
import { useApi } from '@/hooks/useApi';
import { DiscountForm } from '@/modules/discount/forms/DiscountForm';
import { DeleteConfirmDialog } from '@/modules/discount/forms/DeleteConfirmDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  type Discount
} from '@/modules/discount/api/discountApi';

export const DiscountsPage: React.FC = () => {
  // State for form and dialog management
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedDiscount, setSelectedDiscount] = React.useState<Discount | null>(null);
  const [formMode, setFormMode] = React.useState<'add' | 'edit'>('add');

  // API calls using useApi hook
  const { data: discounts, loading: isLoading, error, execute: refetchDiscounts } = useApi<Discount[]>(getDiscounts);

  // Wrapper functions for useApi compatibility
  const createDiscountWrapper = (...args: unknown[]) => {
    const discountData = args[0] as Omit<Discount, 'id'>;
    return createDiscount(discountData);
  };

  const updateDiscountWrapper = (...args: unknown[]) => {
    const id = args[0] as string;
    const discountData = args[1] as Partial<Discount>;
    return updateDiscount(id, discountData);
  };

  const deleteDiscountWrapper = (...args: unknown[]) => {
    const id = args[0] as string;
    return deleteDiscount(id);
  };

  const { execute: executeCreate } = useApi<Discount>(createDiscountWrapper, [], false);
  const { execute: executeUpdate } = useApi<Discount>(updateDiscountWrapper, [], false);
  const { execute: executeDelete } = useApi<void>(deleteDiscountWrapper, [], false);

  // Handlers for CRUD operations
  const handleAddDiscount = () => {
    setSelectedDiscount(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleEditDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (discountData: Omit<Discount, 'id'>) => {
    try {
      if (formMode === 'add') {
        await executeCreate(discountData);
        refetchDiscounts();
        setIsFormOpen(false);
      } else if (selectedDiscount) {
        await executeUpdate(selectedDiscount.id, discountData);
        refetchDiscounts();
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error('Error saving discount:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDiscount) return;

    try {
      await executeDelete(selectedDiscount.id);
      refetchDiscounts();
      setIsDeleteDialogOpen(false);
      setSelectedDiscount(null);
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedDiscount(null);
  };

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedDiscount(null);
  };

  const columns: TableColumn<Discount>[] = [
    {
      key: 'name',
      label: 'Nazwa',
      sortable: true,
    },
    {
      key: 'percentage',
      label: 'Procent',
      sortable: true,
      render: (value: unknown) => {
        const numValue = typeof value === 'number' ? value : parseFloat(value as string);
        return isNaN(numValue) ? 'N/A' : `${numValue}%`;
      },
    },
    {
      key: 'description',
      label: 'Opis',
      sortable: true,
    },
  ];

  const tableConfig: TableConfig<Discount> = {
    columns,
    searchable: true,
    addButton: {
      label: 'Dodaj rabat',
      onClick: handleAddDiscount,
    },
    pagination: {
      pageSize: 5,
      showSizeChanger: true,
      pageSizeOptions: [5, 10, 20, 50],
    },
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p>Ładowanie rabatów...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-destructive">Błąd podczas ładowania rabatów: {error.message || 'Nieznany błąd'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rabaty</h1>
          <p className="text-muted-foreground">
            Zarządzaj rabatami
          </p>
        </div>
      </div>

      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Lista rabatów</CardTitle>
          <CardDescription>
            Wszystkie rabaty w systemie ({discounts?.length || 0})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={discounts || []}
            config={tableConfig}
            onEdit={handleEditDiscount}
            onDelete={handleDeleteDiscount}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>

      {/* Dialogi */}
      <DiscountForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        discount={selectedDiscount}
        title={formMode === 'add' ? 'Dodaj nowy rabat' : 'Edytuj rabat'}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Usuń rabat"
        description="Czy na pewno chcesz usunąć ten rabat?"
        itemName={selectedDiscount?.name}
      />
    </div>
  );
};
