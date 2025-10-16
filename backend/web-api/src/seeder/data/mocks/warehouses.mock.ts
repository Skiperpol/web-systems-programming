import { v4 as uuidv4 } from 'uuid';

export interface WarehouseMockData {
  id: string;
  name: string;
  address: string;
  capacity: number;
}

export const WAREHOUSES_MOCK_DATA: WarehouseMockData[] = [
  {
    id: uuidv4(),
    name: 'Magazyn Centralny Warszawa',
    address: 'ul. Przemysłowa 15, 00-001 Warszawa',
    capacity: 10000,
  },
  {
    id: uuidv4(),
    name: 'Magazyn Regionalny Kraków',
    address: 'ul. Logistyczna 8, 30-001 Kraków',
    capacity: 7500,
  },
  {
    id: uuidv4(),
    name: 'Magazyn Północny Gdańsk',
    address: 'ul. Portowa 22, 80-001 Gdańsk',
    capacity: 6000,
  },
  {
    id: uuidv4(),
    name: 'Magazyn Południowy Wrocław',
    address: 'ul. Magazynowa 5, 50-001 Wrocław',
    capacity: 8000,
  },
  {
    id: uuidv4(),
    name: 'Magazyn Wschodni Lublin',
    address: 'ul. Przemysłowa 12, 20-001 Lublin',
    capacity: 5000,
  },
  {
    id: uuidv4(),
    name: 'Magazyn Zachodni Poznań',
    address: 'ul. Dystrybucyjna 3, 60-001 Poznań',
    capacity: 7000,
  },
  {
    id: uuidv4(),
    name: 'Magazyn Śląski Katowice',
    address: 'ul. Przemysłowa 25, 40-001 Katowice',
    capacity: 6500,
  },
  {
    id: uuidv4(),
    name: 'Magazyn Podlaski Białystok',
    address: 'ul. Magazynowa 7, 15-001 Białystok',
    capacity: 4500,
  },
  {
    id: uuidv4(),
    name: 'Magazyn Lubuski Zielona Góra',
    address: 'ul. Dystrybucyjna 11, 65-001 Zielona Góra',
    capacity: 5500,
  },
  {
    id: uuidv4(),
    name: 'Magazyn Zachodniopomorski Szczecin',
    address: 'ul. Portowa 18, 70-001 Szczecin',
    capacity: 6200,
  },
];
