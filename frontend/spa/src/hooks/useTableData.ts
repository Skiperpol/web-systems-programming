import { useState, useEffect, useCallback } from 'react';

export interface UseTableDataOptions<T> {
  fetchData: () => Promise<T[]>;
  createItem?: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => Promise<T>;
  updateItem?: (id: string, data: Partial<T>) => Promise<T>;
  deleteItem?: (id: string) => Promise<void>;
  onError?: (error: Error) => void;
}

export interface UseTableDataReturn<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  isFormOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedItem: T | null;
  formMode: 'add' | 'edit';
  
  loadData: () => Promise<void>;
  handleAdd: () => void;
  handleEdit: (item: T) => void;
  handleDelete: (item: T) => void;
  handleFormSubmit: (formData: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  handleDeleteConfirm: () => Promise<void>;
  handleFormClose: () => void;
  handleDeleteClose: () => void;
  
  setIsFormOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setSelectedItem: (item: T | null) => void;
  setFormMode: (mode: 'add' | 'edit') => void;
}

export function useTableData<T extends { id: string | number }>({
  fetchData,
  createItem,
  updateItem,
  deleteItem,
  onError,
}: UseTableDataOptions<T>): UseTableDataReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchData();
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, onError]);

  const handleAdd = useCallback(() => {
    setSelectedItem(null);
    setFormMode('add');
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((item: T) => {
    setSelectedItem(item);
    setFormMode('edit');
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback((item: T) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleFormSubmit = useCallback(async (formData: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (formMode === 'add' && createItem) {
        const newItem = await createItem(formData);
        setData(prev => [...prev, newItem]);
        setIsFormOpen(false);
      } else if (formMode === 'edit' && selectedItem && updateItem) {
        const updatedItem = await updateItem(selectedItem.id.toString(), formData as Partial<T>);
        setData(prev => prev.map(item =>
          item.id === selectedItem.id ? updatedItem : item
        ));
        setIsFormOpen(false);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message);
      onError?.(error);
    }
  }, [formMode, selectedItem, createItem, updateItem, onError]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedItem || !deleteItem) return;
    
    try {
      await deleteItem(selectedItem.id.toString());
      setData(prev => prev.filter(item => item.id !== selectedItem.id));
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message);
      onError?.(error);
    }
  }, [selectedItem, deleteItem, onError]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setSelectedItem(null);
  }, []);

  const handleDeleteClose = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    isLoading,
    error,
    isFormOpen,
    isDeleteDialogOpen,
    selectedItem,
    formMode,
    loadData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFormSubmit,
    handleDeleteConfirm,
    handleFormClose,
    handleDeleteClose,
    setIsFormOpen,
    setIsDeleteDialogOpen,
    setSelectedItem,
    setFormMode,
  };
}