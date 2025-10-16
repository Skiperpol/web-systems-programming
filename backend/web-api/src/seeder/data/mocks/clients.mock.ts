import { v4 as uuidv4 } from 'uuid';

export interface ClientMockData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const CLIENTS_MOCK_DATA: ClientMockData[] = [
  {
    id: uuidv4(),
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com',
    phone: '+48123456789',
  },
  {
    id: uuidv4(),
    firstName: 'Anna',
    lastName: 'Nowak',
    email: 'anna.nowak@example.com',
    phone: '+48987654321',
  },
  {
    id: uuidv4(),
    firstName: 'Piotr',
    lastName: 'Wiśniewski',
    email: 'piotr.wisniewski@example.com',
    phone: '+48555666777',
  },
  {
    id: uuidv4(),
    firstName: 'Maria',
    lastName: 'Dąbrowska',
    email: 'maria.dabrowska@example.com',
    phone: '+48111222333',
  },
  {
    id: uuidv4(),
    firstName: 'Tomasz',
    lastName: 'Lewandowski',
    email: 'tomasz.lewandowski@example.com',
    phone: '+48444555666',
  },
  {
    id: uuidv4(),
    firstName: 'Katarzyna',
    lastName: 'Wójcik',
    email: 'katarzyna.wojcik@example.com',
    phone: '+48777888999',
  },
  {
    id: uuidv4(),
    firstName: 'Michał',
    lastName: 'Kamiński',
    email: 'michal.kaminski@example.com',
    phone: '+48123456780',
  },
  {
    id: uuidv4(),
    firstName: 'Agnieszka',
    lastName: 'Zielińska',
    email: 'agnieszka.zielinska@example.com',
    phone: '+48987654320',
  },
  {
    id: uuidv4(),
    firstName: 'Paweł',
    lastName: 'Szymański',
    email: 'pawel.szymanski@example.com',
    phone: '+48555111222',
  },
  {
    id: uuidv4(),
    firstName: 'Magdalena',
    lastName: 'Woźniak',
    email: 'magdalena.wozniak@example.com',
    phone: '+48666777888',
  },
];
