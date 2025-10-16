import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();
  
  const pageNames: Record<string, string> = {
    '/': 'Dashboard',
    '/clients': 'Klienci',
    '/products': 'Produkty',
    '/warehouses': 'Magazyny',
    '/discounts': 'Promocje',
    '/discounts-view': 'Podgląd Promocji',
  };
  
  const currentPageName = pageNames[location.pathname] || 'Dashboard';
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100 transition-colors duration-200" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{currentPageName}</h1>
        </div>
      </div>
    
    </header>
  );
};
