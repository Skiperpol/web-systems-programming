import React from 'react';
import { DataTable, type TableColumn, type TableConfig } from '@/components/data-table';
import { useTableData } from '@/hooks/useTableData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Example Product type
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const ProductsPage: React.FC = () => {
  // Mock API functions for products
  const fetchProducts = async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        name: 'Laptop Dell XPS 13',
        price: 4999.99,
        category: 'Elektronika',
        stock: 15,
        description: 'Wysokiej jakości laptop biznesowy',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        name: 'iPhone 15 Pro',
        price: 4999.00,
        category: 'Telefony',
        stock: 8,
        description: 'Najnowszy iPhone z zaawansowaną kamerą',
        createdAt: '2024-01-16T14:20:00Z',
        updatedAt: '2024-01-16T14:20:00Z',
      },
      {
        id: '3',
        name: 'Samsung Galaxy S24',
        price: 3999.00,
        category: 'Telefony',
        stock: 12,
        description: 'Flagiowy smartfon Samsung',
        createdAt: '2024-01-17T09:15:00Z',
        updatedAt: '2024-01-17T09:15:00Z',
      },
    ];
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      ...productData,
      id,
      updatedAt: new Date().toISOString(),
    } as Product;
  };

  const deleteProduct = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  };

  const {
    data: products,
    isLoading,
    error,
    isFormOpen,
    isDeleteDialogOpen,
    selectedItem: selectedProduct,
    formMode,
    handleAdd: handleAddProduct,
    handleEdit: handleEditProduct,
    handleDelete: handleDeleteProduct,
    handleFormSubmit,
    handleDeleteConfirm,
    handleFormClose,
    handleDeleteClose,
  } = useTableData<Product>({
    fetchData: fetchProducts,
    createItem: createProduct,
    updateItem: updateProduct,
    deleteItem: deleteProduct,
    onError: (error) => console.error('API Error:', error),
  });

  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      label: 'Nazwa',
      sortable: true,
    },
    {
      key: 'price',
      label: 'Cena',
      sortable: true,
      render: (value: number) => `${value.toFixed(2)} zł`,
    },
    {
      key: 'category',
      label: 'Kategoria',
      sortable: true,
      render: (value: string) => (
        <Badge variant="secondary">{value}</Badge>
      ),
    },
    {
      key: 'stock',
      label: 'Stan magazynowy',
      sortable: true,
      render: (value: number) => (
        <Badge variant={value > 10 ? 'default' : value > 0 ? 'outline' : 'destructive'}>
          {value} szt.
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Data utworzenia',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('pl-PL'),
    },
  ];

  const tableConfig: TableConfig<Product> = {
    columns,
    searchable: true,
    addButton: {
      label: 'Dodaj produkt',
      onClick: handleAddProduct,
    },
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p>Ładowanie produktów...</p>
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
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produkty</h1>
          <p className="text-muted-foreground">
            Zarządzaj katalogiem produktów
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista produktów</CardTitle>
          <CardDescription>
            Wszystkie produkty w systemie ({products.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={products}
            config={tableConfig}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>

      {/* Tutaj można dodać formularz produktu i dialog potwierdzenia */}
      {/* <ProductForm ... /> */}
      {/* <DeleteConfirmDialog ... /> */}
    </div>
  );
};
