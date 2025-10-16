import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye 
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
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
  pagination?: {
    pageSize?: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
  };
}

export interface DataTableProps<T> {
  data: T[];
  config: TableConfig<T>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function DataTable<T extends { id: string | number }>({
  data,
  config,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
  error = null,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(config.pagination?.pageSize || 10);

  useEffect(() => {
    setFilteredData(data);
    setCurrentPage(1); // Reset to first page when data changes
  }, [data]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Ładowanie danych...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {config.searchable && (
            <div className="relative bg-white">
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

      <div className="rounded-md border bg-white">
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
              {paginatedData.map((row) => (
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Pokazano {startIndex + 1}-{Math.min(endIndex, filteredData.length)} z {filteredData.length} rekordów
          </span>
          
          {config.pagination?.showSizeChanger && (
            <div className="flex items-center gap-2">
              <span>Pokaż:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="rounded border border-gray-300 px-2 py-1 text-sm"
              >
                {(config.pagination?.pageSizeOptions || [5, 10, 20, 50]).map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  size="default"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      size="icon"
                      onClick={() => handlePageChange(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  size="default"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}