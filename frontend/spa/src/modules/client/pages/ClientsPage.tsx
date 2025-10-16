import React from 'react';
import { DataTable, type TableColumn, type TableConfig } from '@/components/data-table';
import { useApi } from '@/hooks/useApi';
import { ClientForm } from '@/modules/client/forms/ClientForm';
import { DeleteConfirmDialog } from '@/modules/client/forms/DeleteConfirmDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  getClients, 
  createClient, 
  updateClient, 
  deleteClient, 
  type Client 
} from '@/modules/client/api/clientApi';

export const ClientsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
  const [formMode, setFormMode] = React.useState<'add' | 'edit'>('add');

  const { data: clients, loading: isLoading, error, execute: refetchClients } = useApi<Client[]>(getClients);
  
  const createClientWrapper = (...args: unknown[]) => {
    const clientData = args[0] as Omit<Client, 'id'>;
    return createClient(clientData);
  };
  
  const updateClientWrapper = (...args: unknown[]) => {
    const id = args[0] as string;
    const clientData = args[1] as Partial<Client>;
    return updateClient(id, clientData);
  };
  
  const deleteClientWrapper = (...args: unknown[]) => {
    const id = args[0] as string;
    return deleteClient(id);
  };
  
  const { execute: executeCreate } = useApi<Client>(createClientWrapper, [], false);
  const { execute: executeUpdate } = useApi<Client>(updateClientWrapper, [], false);
  const { execute: executeDelete } = useApi<void>(deleteClientWrapper, [], false);

  const handleAddClient = () => {
    setSelectedClient(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (clientData: Omit<Client, 'id'>) => {
    try {
      if (formMode === 'add') {
        await executeCreate(clientData);
        refetchClients();
        setIsFormOpen(false);
      } else if (selectedClient) {
        await executeUpdate(selectedClient.id, clientData);
        refetchClients();
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClient) return;
    
    try {
      await executeDelete(selectedClient.id);
      refetchClients();
      setIsDeleteDialogOpen(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedClient(null);
  };

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedClient(null);
  };

  const columns: TableColumn<Client>[] = [
    {
      key: 'firstName',
      label: 'Imię',
      sortable: true,
    },
    {
      key: 'lastName',
      label: 'Nazwisko',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Telefon',
      sortable: true,
    },
  ];

  const tableConfig: TableConfig<Client> = {
    columns,
    searchable: true,
    addButton: {
      label: 'Dodaj klienta',
      onClick: handleAddClient,
    },
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p>Ładowanie klientów...</p>
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
            <p className="text-destructive">Błąd podczas ładowania klientów: {error.message || 'Nieznany błąd'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Klienci</h1>
          <p className="text-muted-foreground">
            Zarządzaj bazą klientów
          </p>
        </div>
      </div>

      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Lista klientów</CardTitle>
          <CardDescription>
            Wszystkie klienci w systemie ({clients?.length || 0})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={clients || []}
            config={tableConfig}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>

      <ClientForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        client={selectedClient}
        title={formMode === 'add' ? 'Dodaj nowego klienta' : 'Edytuj klienta'}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Usuń klienta"
        description="Czy na pewno chcesz usunąć tego klienta?"
        itemName={selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : undefined}
      />
    </div>
  );
};
