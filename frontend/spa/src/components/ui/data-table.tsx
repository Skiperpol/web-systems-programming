import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye 
} from 'lucide-react';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export interface TableConfig<T> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  searchable?: boolean;
  addButton?: {
    label: string;
    onClick: () => void;
  };
}

export interface DataTableProps<T> {
  data: T[];
  config: TableConfig<T>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  data,
  config,
  onEdit,
  onDelete,
  onView,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filteredData, setFilteredData] = useState<T[]>(data);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleSort = (key: keyof T) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return newDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setSortKey(key);
    setSortDirection(newDirection);
    setFilteredData(sorted);
  };

  return (
      <div className="space-y-4">
        {/* Header z wyszukiwaniem i przyciskiem dodawania */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {config.searchable && (
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Szukaj..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            )}
          </div>
          
          {config.addButton && (
            <Button onClick={config.addButton.onClick} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {config.addButton.label}
            </Button>
          )}
        </div>

        {/* Tabela */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {config.columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && sortKey === column.key && (
                        <span className="text-xs">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
                {(config.actions || onEdit || onDelete || onView) && (
                  <TableHead className="w-[100px]">Akcje</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id}>
                  {config.columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render 
                        ? column.render(row[column.key], row)
                        : String(row[column.key])
                      }
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(row)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Zobacz
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(row)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edytuj
                          </DropdownMenuItem>
                        )}
                        {config.actions?.map((action, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => action.onClick(row)}
                            className={action.variant === 'destructive' ? 'text-destructive' : ''}
                          >
                            {action.icon && <span className="mr-2">{action.icon}</span>}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                        {onDelete && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(row)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Usuń
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Informacja o ilości wyników */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Znaleziono {filteredData.length} z {data.length} rekordów
          </span>
        </div>
      </div>
    );
};
