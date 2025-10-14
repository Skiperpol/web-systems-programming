# Web Systems Programming API

## Opis projektu

Jest to implementacja aplikacji WebAPI zgodna z architekturą Hexagonalną (Ports & Adapters), implementująca cztery podstawowe operacje na danych CRUD (Create, Read, Update, Delete) i wykorzystująca DTOs (Data Transfer Objects) do walidacji i transferu danych.

## Architektura Hexagonalna

Aplikacja została zbudowana zgodnie z zasadami architektury Hexagonalnej, która zapewnia:

- **Separację warstw**: Domain, Application, Infrastructure
- **Niezależność od frameworków**: Core business logic jest oddzielona od szczegółów implementacji
- **Łatwość testowania**: Każda warstwa może być testowana niezależnie
- **Elastyczność**: Łatwa wymiana adapterów bez wpływu na logikę biznesową

### Struktura modułów

Każdy moduł (Products, Warehouses, Discounts, Clients) składa się z:

```
src/
├── domain/
│   ├── model/           # Modele domenowe (business logic)
│   ├── ports/           # Interfejsy (porty)
│   └── types/           # Typy i interfejsy domenowe
├── application/         # Serwisy aplikacyjne
└── adapters/
    ├── api/             # Kontrolery i DTOs
    │   └── dtos/        # Data Transfer Objects
    └── persistence/     # Repozytoria i encje TypeORM
```

## CRUD Operations

Aplikacja implementuje standardowe operacje CRUD dla każdego modułu:

### Products
- `POST /api/products` - Utwórz nowy produkt
- `GET /api/products` - Pobierz wszystkie produkty
- `GET /api/products/:id` - Pobierz produkt po ID
- `PUT /api/products/:id/price` - Aktualizuj cenę produktu
- `DELETE /api/products/:id` - Usuń produkt

### Warehouses
- `POST /api/warehouses` - Utwórz nowy magazyn
- `GET /api/warehouses` - Pobierz wszystkie magazyny
- `GET /api/warehouses/:id` - Pobierz magazyn po ID
- `PUT /api/warehouses/:id/capacity` - Aktualizuj pojemność magazynu
- `DELETE /api/warehouses/:id` - Usuń magazyn

### Discounts
- `POST /api/discounts` - Utwórz nową zniżkę
- `GET /api/discounts` - Pobierz wszystkie zniżki
- `GET /api/discounts/:id` - Pobierz zniżkę po ID
- `PUT /api/discounts/:id/percentage` - Aktualizuj procent zniżki
- `DELETE /api/discounts/:id` - Usuń zniżkę

### Clients
- `POST /api/clients` - Utwórz nowego klienta
- `GET /api/clients` - Pobierz wszystkich klientów
- `GET /api/clients/:id` - Pobierz klienta po ID
- `PUT /api/clients/:id/email` - Aktualizuj email klienta
- `DELETE /api/clients/:id` - Usuń klienta

## DTOs (Data Transfer Objects)

DTOs zapewniają walidację danych wejściowych i kontrolę struktury odpowiedzi:

### Przykład CreateProductDto
```typescript
export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Laptop Dell XPS 13',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 1299.99,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'High-performance laptop with 13-inch display',
  })
  @IsString()
  readonly description: string;
}
```

## Technologie

- **NestJS** - Framework Node.js
- **TypeORM** - ORM dla PostgreSQL
- **PostgreSQL** - Baza danych
- **class-validator** - Walidacja DTOs
- **class-transformer** - Transformacja danych
- **Swagger** - Dokumentacja API
- **Jest** - Framework testowy

## Instalacja i uruchomienie

### Wymagania
- Node.js (v18+)
- PostgreSQL (v12+)
- npm lub yarn

### Konfiguracja bazy danych

1. Zainstaluj PostgreSQL
2. Utwórz bazę danych:
```bash
createdb web_systems_db
```

### Konfiguracja środowiska

1. Skopiuj plik `.env.example` do `.env`:
```bash
cp .env.example .env
```

2. Edytuj plik `.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=web_systems_db

# Application Configuration
NODE_ENV=development
PORT=3000
```

### Instalacja zależności

```bash
npm install
```

### Uruchomienie aplikacji

```bash
# Tryb development
npm run start:dev

# Tryb production
npm run start:prod
```

Aplikacja będzie dostępna pod adresem: `http://localhost:3000`

## Swagger Documentation

Dokumentacja API jest automatycznie generowana i dostępna pod adresem:
**http://localhost:3000/api/docs**

### Funkcje Swagger UI:
- Interaktywna dokumentacja wszystkich endpointów
- Możliwość testowania API bezpośrednio z przeglądarki
- Szczegółowe opisy parametrów i odpowiedzi
- Przykłady danych wejściowych i wyjściowych
- Podział na kategorie (tags) dla każdego modułu

### Przykład użycia:
1. Otwórz http://localhost:3000/api/docs
2. Rozwiń sekcję "products"
3. Kliknij na endpoint "POST /api/products"
4. Kliknij "Try it out"
5. Wprowadź dane w formacie JSON
6. Kliknij "Execute" aby przetestować endpoint

## Testy

### Struktura testów

Projekt zawiera testy jednostkowe dla:
- **Modeli domenowych** - testy logiki biznesowej
- **Serwisów aplikacyjnych** - testy z mockami repozytoriów

### Uruchamianie testów

```bash
# Uruchom wszystkie testy
npm test

# Uruchom testy w trybie watch
npm run test:watch

# Uruchom testy z pokryciem kodu
npm run test:cov

# Uruchom testy e2e
npm run test:e2e
```

### Przykład testu jednostkowego

```typescript
describe('ProductModel', () => {
  let productModel: ProductModel;

  beforeEach(() => {
    productModel = new ProductModel(
      'test-id',
      'Test Product',
      99.99,
      'Test Description'
    );
  });

  it('should create a product with valid data', () => {
    expect(productModel.id).toBe('test-id');
    expect(productModel.name).toBe('Test Product');
    expect(productModel.price).toBe(99.99);
  });

  it('should update price with valid value', () => {
    productModel.updatePrice(149.99);
    expect(productModel.price).toBe(149.99);
  });
});
```

## Konfiguracja środowiska (.env)

### Zmienne środowiskowe

| Zmienna | Opis | Domyślna wartość |
|---------|------|------------------|
| `DB_HOST` | Host bazy danych | `localhost` |
| `DB_PORT` | Port bazy danych | `5432` |
| `DB_USERNAME` | Nazwa użytkownika bazy danych | `postgres` |
| `DB_PASSWORD` | Hasło bazy danych | `password` |
| `DB_DATABASE` | Nazwa bazy danych | `web_systems_db` |
| `NODE_ENV` | Środowisko aplikacji | `development` |
| `PORT` | Port aplikacji | `3000` |

## Skrypty NPM

| Skrypt | Opis |
|--------|------|
| `npm run build` | Kompilacja aplikacji |
| `npm run start` | Uruchomienie aplikacji |
| `npm run start:dev` | Uruchomienie w trybie development |
| `npm run start:prod` | Uruchomienie w trybie production |
| `npm test` | Uruchomienie testów |
| `npm run test:watch` | Uruchomienie testów w trybie watch |
| `npm run test:cov` | Uruchomienie testów z pokryciem |
| `npm run lint` | Sprawdzenie kodu ESLint |
| `npm run format` | Formatowanie kodu Prettier |

## Licencja

Ten projekt jest licencjonowany na licencji MIT - zobacz plik [LICENSE](LICENSE) dla szczegółów.