import { BrowserRouter as Router } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ClientsPage } from './modules/client/pages/ClientsPage';
import { WarehousesPage } from './modules/warehouse/pages/WarehousesPage';
import { DiscountsPage } from './modules/discount/pages/DiscountsPage';
import { ProductsPage } from './modules/product/pages/ProductsPage';

type RouteConfig = [string, React.ReactNode];

const links: RouteConfig[] = [
  ["/products", <ProductsPage />],
  ["/warehouses", <WarehousesPage />],
  ["/discounts", <DiscountsPage />],
  ["/clients", <ClientsPage />],
  ["/discounts-view", null],
];

function App() {
  return (
    <Router>
      <MainLayout links={links} />
    </Router>
  );
}

export default App;