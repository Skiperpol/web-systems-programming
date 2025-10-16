import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Package,
  Warehouse,
  Percent,
  Users,
  Eye,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Klienci',
    url: '/clients',
    icon: Users,
    badge: 'Klienci',
  },
  {
    title: 'Produkty',
    url: '/products',
    icon: Package,
    badge: 'Produkty',
  },
  {
    title: 'Magazyny',
    url: '/warehouses',
    icon: Warehouse,
    badge: 'Magazyny',
  },
  {
    title: 'Promocje',
    url: '/discounts',
    icon: Percent,
    badge: 'Promocje',
  },
  {
    title: 'Podgląd Promocji',
    url: '/discounts-view',
    icon: Eye,
    badge: 'Podgląd',
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="bg-gray-100 dark:bg-gray-900">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold">System Zarządzania</span>
            <span className="truncate text-xs text-muted-foreground">
              Web Systems Programming
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Nawigacja</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100 data-[active=true]:bg-blue-500 data-[active=true]:text-white transition-colors duration-200"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          © 2025 Web Systems Programming
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
