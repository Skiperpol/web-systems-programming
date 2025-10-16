import { BrowserRouter as Router } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';

type RouteConfig = [string, React.ReactNode];

const links: RouteConfig[] = [
  ["/", <Dashboard />], 
  ["/products", null],
  ["/warehouses", null],
  ["/discounts", null],
  ["/clients", null],
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