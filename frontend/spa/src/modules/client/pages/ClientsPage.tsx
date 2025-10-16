import React, { useState, useEffect } from 'react';
import { DataTable, type TableColumn, type TableConfig } from '@/components/ui/data-table';
import { ClientForm, type Client } from '@/modules/client/forms/ClientForm';
import { DeleteConfirmDialog } from '@/modules/client/forms/DeleteConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Symulacja API - w rzeczywistej aplikacji tutaj byłby fetch do API
      const mockClients: Client[] = [
        {
          id: '1',
          name: 'Jan Kowalski',
          email: 'jan.kowalski@example.com',
          phone: '+48 123 456 789',
          address: 'ul. Przykładowa 123',
          city: 'Warszawa',
          postalCode: '00-001',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          name: 'Anna Nowak',
          email: 'anna.nowak@example.com',
          phone: '+48 987 654 321',
          address: 'ul. Testowa 456',
          city: 'Kraków',
          postalCode: '30-001',
          createdAt: '2024-01-16T14:20:00Z',
          updatedAt: '2024-01-16T14:20:00Z',
        },
        {
          id: '3',
          name: 'Piotr Wiśniewski',
          email: 'piotr.wisniewski@example.com',
          phone: '+48 555 123 456',
          address: 'ul. Demo 789',
          city: 'Gdańsk',
          postalCode: '80-001',
          createdAt: '2024-01-17T09:15:00Z',
          updatedAt: '2024-01-17T09:15:00Z',
        },
      ];
      
      setClients(mockClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      setError('Błąd podczas ładowania klientów');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleFormSubmit = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (formMode === 'add') {
        // Symulacja dodawania nowego klienta
        const newClient: Client = {
          ...clientData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setClients(prev => [...prev, newClient]);
        setIsFormOpen(false);
      } else if (selectedClient) {
        // Symulacja edycji klienta
        const updatedClient: Client = {
          ...selectedClient,
          ...clientData,
          updatedAt: new Date().toISOString(),
        };
        
        setClients(prev => prev.map(client =>
          client.id === selectedClient.id ? updatedClient : client
        ));
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClient) return;
    
    try {
      // Symulacja usuwania klienta
      setClients(prev => prev.filter(client => client.id !== selectedClient.id));
      setIsDeleteDialogOpen(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const columns: TableColumn<Client>[] = [
    {
      key: 'name',
      label: 'Nazwa',
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
    {
      key: 'city',
      label: 'Miasto',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Data utworzenia',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('pl-PL'),
    },
    {
      key: 'updatedAt',
      label: 'Ostatnia aktualizacja',
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline">
          {new Date(value).toLocaleDateString('pl-PL')}
        </Badge>
      ),
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
          <h1 className="text-3xl font-bold">Klienci</h1>
          <p className="text-muted-foreground">
            Zarządzaj bazą klientów
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista klientów</CardTitle>
          <CardDescription>
            Wszystkie klienci w systemie ({clients.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={clients}
            config={tableConfig}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
          />
        </CardContent>
      </Card>

      {/* Dialogi */}
      <ClientForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedClient(null);
        }}
        onSubmit={handleFormSubmit}
        client={selectedClient}
        title={formMode === 'add' ? 'Dodaj nowego klienta' : 'Edytuj klienta'}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedClient(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Usuń klienta"
        description="Czy na pewno chcesz usunąć tego klienta?"
        itemName={selectedClient?.name}
      />
    </div>
  );
};
