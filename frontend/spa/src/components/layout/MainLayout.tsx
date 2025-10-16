import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '../app-sidebar';
import { Header } from '../header';

type RouteConfig = [string, React.ReactNode];

interface MainLayoutProps {
  links: RouteConfig[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({ links }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6">
          <Routes>
            {links.map(([path, element]) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};