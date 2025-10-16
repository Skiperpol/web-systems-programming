import React from 'react';
import { DataTable, type TableColumn, type TableConfig } from '@/components/data-table';
import { useApi } from '@/hooks/useApi';
import { ProductForm } from '@/modules/product/forms/ProductForm';
import { DeleteConfirmDialog } from '@/modules/product/forms/DeleteConfirmDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product
} from '@/modules/product/api/productApi';

export const ProductsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [formMode, setFormMode] = React.useState<'add' | 'edit'>('add');

  const { data: products, loading: isLoading, error, execute: refetchProducts } = useApi<Product[]>(getProducts);

  const createProductWrapper = (...args: unknown[]) => {
    const productData = args[0] as Omit<Product, 'id'>;
    return createProduct(productData);
  };

  const updateProductWrapper = (...args: unknown[]) => {
    const id = args[0] as string;
    const productData = args[1] as Partial<Product>;
    return updateProduct(id, productData);
  };

  const deleteProductWrapper = (...args: unknown[]) => {
    const id = args[0] as string;
    return deleteProduct(id);
  };

  const { execute: executeCreate } = useApi<Product>(createProductWrapper, [], false);
  const { execute: executeUpdate } = useApi<Product>(updateProductWrapper, [], false);
  const { execute: executeDelete } = useApi<void>(deleteProductWrapper, [], false);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (productData: Omit<Product, 'id'>) => {
    try {
      if (formMode === 'add') {
        await executeCreate(productData);
        refetchProducts();
        setIsFormOpen(false);
      } else if (selectedProduct) {
        await executeUpdate(selectedProduct.id, productData);
        refetchProducts();
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      await executeDelete(selectedProduct.id);
      refetchProducts();
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

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
      render: (value: unknown) => {
        const numValue = typeof value === 'number' ? value : parseFloat(value as string);
        return isNaN(numValue) ? 'N/A' : `$${numValue.toFixed(2)}`;
      },
    },
    {
      key: 'description',
      label: 'Opis',
      sortable: true,
    },
  ];

  const tableConfig: TableConfig<Product> = {
    columns,
    searchable: true,
    addButton: {
      label: 'Dodaj produkt',
      onClick: handleAddProduct,
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
            <p className="text-destructive">Błąd podczas ładowania produktów: {error.message || 'Nieznany błąd'}</p>
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

      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Lista produktów</CardTitle>
          <CardDescription>
            Wszystkie produkty w katalogu ({products?.length || 0})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={products || []}
            config={tableConfig}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>

      <ProductForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        title={formMode === 'add' ? 'Dodaj nowy produkt' : 'Edytuj produkt'}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Usuń produkt"
        description="Czy na pewno chcesz usunąć ten produkt?"
        itemName={selectedProduct?.name}
      />
    </div>
  );
};
