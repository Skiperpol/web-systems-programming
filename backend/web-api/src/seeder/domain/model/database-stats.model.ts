export class DatabaseStatsModel {
  public readonly clients: number;
  public readonly products: number;
  public readonly warehouses: number;
  public readonly discounts: number;
  public readonly timestamp: Date;

  constructor(
    clients: number,
    products: number,
    warehouses: number,
    discounts: number,
  ) {
    this.clients = clients;
    this.products = products;
    this.warehouses = warehouses;
    this.discounts = discounts;
    this.timestamp = new Date();
  }

  public getTotalRecords(): number {
    return this.clients + this.products + this.warehouses + this.discounts;
  }

  public isEmpty(): boolean {
    return this.getTotalRecords() === 0;
  }

  public toJSON(): object {
    return {
      clients: this.clients,
      products: this.products,
      warehouses: this.warehouses,
      discounts: this.discounts,
      total: this.getTotalRecords(),
      isEmpty: this.isEmpty(),
      timestamp: this.timestamp.toISOString(),
    };
  }
}
