import React from 'react';
import { DataTable, type TableColumn, type TableConfig } from '@/components/data-table';
import { useApi } from '@/hooks/useApi';
import { WarehouseForm } from '@/modules/warehouse/forms/WarehouseForm';
import { DeleteConfirmDialog } from '@/modules/warehouse/forms/DeleteConfirmDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  type Warehouse
} from '@/modules/warehouse/api/warehouseApi';

export const WarehousesPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<Warehouse | null>(null);
  const [formMode, setFormMode] = React.useState<'add' | 'edit'>('add');

  const { data: warehouses, loading: isLoading, error, execute: refetchWarehouses } = useApi<Warehouse[]>(getWarehouses);

  const createWarehouseWrapper = (...args: unknown[]) => {
    const warehouseData = args[0] as Omit<Warehouse, 'id'>;
    return createWarehouse(warehouseData);
  };

  const updateWarehouseWrapper = (...args: unknown[]) => {
    const id = args[0] as string;
    const warehouseData = args[1] as Partial<Warehouse>;
    return updateWarehouse(id, warehouseData);
  };

  const deleteWarehouseWrapper = (...args: unknown[]) => {
    const id = args[0] as string;
    return deleteWarehouse(id);
  };

  const { execute: executeCreate } = useApi<Warehouse>(createWarehouseWrapper, [], false);
  const { execute: executeUpdate } = useApi<Warehouse>(updateWarehouseWrapper, [], false);
  const { execute: executeDelete } = useApi<void>(deleteWarehouseWrapper, [], false);

  const handleAddWarehouse = () => {
    setSelectedWarehouse(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (warehouseData: Omit<Warehouse, 'id'>) => {
    try {
      if (formMode === 'add') {
        await executeCreate(warehouseData);
        refetchWarehouses();
        setIsFormOpen(false);
      } else if (selectedWarehouse) {
        await executeUpdate(selectedWarehouse.id, warehouseData);
        refetchWarehouses();
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error('Error saving warehouse:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedWarehouse) return;

    try {
      await executeDelete(selectedWarehouse.id);
      refetchWarehouses();
      setIsDeleteDialogOpen(false);
      setSelectedWarehouse(null);
    } catch (error) {
      console.error('Error deleting warehouse:', error);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedWarehouse(null);
  };

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedWarehouse(null);
  };

  const columns: TableColumn<Warehouse>[] = [
    {
      key: 'name',
      label: 'Nazwa',
      sortable: true,
    },
    {
      key: 'address',
      label: 'Adres',
      sortable: true,
    },
    {
      key: 'capacity',
      label: 'Pojemność',
      sortable: true,
      render: (value: unknown) => {
        const numValue = typeof value === 'number' ? value : parseFloat(value as string);
        return isNaN(numValue) ? 'N/A' : `${numValue} m²`;
      },
    },
  ];

  const tableConfig: TableConfig<Warehouse> = {
    columns,
    searchable: true,
    addButton: {
      label: 'Dodaj magazyn',
      onClick: handleAddWarehouse,
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
            <p>Ładowanie magazynów...</p>
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
            <p className="text-destructive">Błąd podczas ładowania magazynów: {error.message || 'Nieznany błąd'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Magazyny</h1>
          <p className="text-muted-foreground">
            Zarządzaj magazynami
          </p>
        </div>
      </div>

      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Lista magazynów</CardTitle>
          <CardDescription>
            Wszystkie magazyny w systemie ({warehouses?.length || 0})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={warehouses || []}
            config={tableConfig}
            onEdit={handleEditWarehouse}
            onDelete={handleDeleteWarehouse}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>

      <WarehouseForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        warehouse={selectedWarehouse}
        title={formMode === 'add' ? 'Dodaj nowy magazyn' : 'Edytuj magazyn'}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Usuń magazyn"
        description="Czy na pewno chcesz usunąć ten magazyn?"
        itemName={selectedWarehouse?.name}
      />
    </div>
  );
};
