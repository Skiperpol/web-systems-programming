import { BrowserRouter as Router } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ClientsPage } from './modules/client/pages/ClientsPage';

type RouteConfig = [string, React.ReactNode];

const links: RouteConfig[] = [
  ["/products", null],
  ["/warehouses", null],
  ["/discounts", null],
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