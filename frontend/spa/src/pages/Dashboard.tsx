import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Badge variant="default">Aktywna strona</Badge>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Witaj w systemie!</CardTitle>
            <CardDescription>
              To jest strona główna twojego systemu zarządzania.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sprawdź sidebar - powinien pokazywać badge z aktualną stroną i przycisk do przełączania.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nawigacja</CardTitle>
            <CardDescription>
              Użyj menu po lewej stronie do nawigacji.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline">Sidebar</Badge>
              <Badge variant="outline">Badge</Badge>
              <Badge variant="outline">Przycisk</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funkcje</CardTitle>
            <CardDescription>
              Dostępne funkcje systemu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">✓ Badge pokazujący aktualną stronę</p>
              <p className="text-sm">✓ Przycisk do przełączania sidebara</p>
              <p className="text-sm">✓ Aktywne menu items</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
