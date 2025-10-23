import { v4 as uuidv4 } from 'uuid';

export interface DiscountMockData {
  id: string;
  name: string;
  percentage: number;
  description: string;
  validFrom: Date;
  validTo: Date;
}

export const DISCOUNTS_MOCK_DATA: DiscountMockData[] = [
  {
    id: uuidv4(),
    name: 'Black Friday 2024',
    percentage: 30,
    description: 'Największa wyprzedaż roku - 30% zniżki na wszystkie produkty',
    validFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dni temu
    validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dni od teraz
  },
  {
    id: uuidv4(),
    name: 'Cyber Monday',
    percentage: 25,
    description: 'Specjalna oferta na elektronikę - 25% zniżki',
    validFrom: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dni temu
    validTo: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 dni od teraz
  },
  {
    id: uuidv4(),
    name: 'Weekendowa Promocja',
    percentage: 15,
    description: '15% zniżki na wszystkie laptopy i komputery',
    validFrom: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dzień temu
    validTo: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 dni od teraz
  },
  {
    id: uuidv4(),
    name: 'Smartfony w Super Cenie',
    percentage: 20,
    description: '20% zniżki na wszystkie smartfony i tablety',
    validFrom: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dni temu
    validTo: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dni od teraz
  },
  {
    id: uuidv4(),
    name: 'Gaming Week',
    percentage: 35,
    description: '35% zniżki na konsole do gier i akcesoria gamingowe',
    validFrom: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dni temu
    validTo: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 dni od teraz
  },
  {
    id: uuidv4(),
    name: 'Audio Premium',
    percentage: 18,
    description: '18% zniżki na słuchawki i sprzęt audio',
    validFrom: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dzień temu
    validTo: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 dni od teraz
  },
  {
    id: uuidv4(),
    name: 'Apple Collection',
    percentage: 12,
    description: '12% zniżki na wszystkie produkty Apple',
    validFrom: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dni temu
    validTo: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 dni od teraz
  },
  {
    id: uuidv4(),
    name: 'TV & Home Entertainment',
    percentage: 22,
    description: '22% zniżki na telewizory i sprzęt domowy',
    validFrom: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 dni temu
    validTo: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dni od teraz
  },
  {
    id: uuidv4(),
    name: 'Back to School',
    percentage: 16,
    description: '16% zniżki na laptopy i tablety dla studentów',
    validFrom: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 dni temu
    validTo: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dzień temu (wygasła)
  },
  {
    id: uuidv4(),
    name: 'Summer Sale',
    percentage: 28,
    description: '28% zniżki na wszystkie produkty w sezonie letnim',
    validFrom: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 dni temu
    validTo: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dni temu (wygasła)
  },
  {
    id: uuidv4(),
    name: 'New Year Special',
    percentage: 40,
    description: '40% zniżki na wybrane produkty w nowym roku',
    validFrom: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 dni od teraz
    validTo: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 dni od teraz
  },
  {
    id: uuidv4(),
    name: 'Tech Tuesday',
    percentage: 14,
    description: '14% zniżki na wszystkie urządzenia technologiczne',
    validFrom: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 dni temu
    validTo: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 dzień od teraz
  },
];
