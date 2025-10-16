import { v4 as uuidv4 } from 'uuid';

export interface ProductMockData {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const PRODUCTS_MOCK_DATA: ProductMockData[] = [
  {
    id: uuidv4(),
    name: 'Laptop Dell XPS 13',
    price: 4999.99,
    description: 'Wysokiej jakości laptop biznesowy z procesorem Intel i7',
  },
  {
    id: uuidv4(),
    name: 'iPhone 15 Pro',
    price: 5499.0,
    description: 'Najnowszy smartfon Apple z zaawansowanym aparatem',
  },
  {
    id: uuidv4(),
    name: 'Samsung Galaxy S24',
    price: 4299.99,
    description: 'Flagiowy smartfon Samsung z systemem Android',
  },
  {
    id: uuidv4(),
    name: 'MacBook Air M2',
    price: 5999.0,
    description: 'Ultrabook Apple z procesorem M2 i ekranem Retina',
  },
  {
    id: uuidv4(),
    name: 'Sony WH-1000XM5',
    price: 1299.99,
    description: 'Słuchawki bezprzewodowe z aktywnym tłumieniem hałasu',
  },
  {
    id: uuidv4(),
    name: 'iPad Pro 12.9"',
    price: 4499.0,
    description: 'Tablet Apple z procesorem M2 i ekranem Liquid Retina',
  },
  {
    id: uuidv4(),
    name: 'Nintendo Switch OLED',
    price: 1899.99,
    description: 'Konsola do gier z większym ekranem OLED',
  },
  {
    id: uuidv4(),
    name: 'AirPods Pro 2',
    price: 1099.99,
    description: 'Słuchawki bezprzewodowe Apple z aktywnym tłumieniem hałasu',
  },
  {
    id: uuidv4(),
    name: 'Samsung 4K TV 55"',
    price: 3299.99,
    description: 'Telewizor Samsung 4K z technologią QLED',
  },
  {
    id: uuidv4(),
    name: 'PlayStation 5',
    price: 2499.99,
    description: 'Konsola do gier Sony z napędem Blu-ray',
  },
  {
    id: uuidv4(),
    name: 'Xbox Series X',
    price: 2299.99,
    description: 'Konsola do gier Microsoft z najnowszymi technologiami',
  },
  {
    id: uuidv4(),
    name: 'Apple Watch Series 9',
    price: 1899.99,
    description: 'Inteligentny zegarek Apple z zaawansowanymi funkcjami',
  },
  {
    id: uuidv4(),
    name: 'Dell Monitor 27" 4K',
    price: 1599.99,
    description: 'Monitor Dell 4K z doskonałą jakością obrazu',
  },
  {
    id: uuidv4(),
    name: 'Logitech MX Master 3S',
    price: 399.99,
    description: 'Mysz bezprzewodowa Logitech dla profesjonalistów',
  },
  {
    id: uuidv4(),
    name: 'Mechanical Keyboard Keychron K8',
    price: 599.99,
    description: 'Klawiatura mechaniczna bezprzewodowa',
  },
];
