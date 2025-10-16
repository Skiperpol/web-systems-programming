export class SeederResultModel {
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

  public toJSON(): object {
    return {
      clients: this.clients,
      products: this.products,
      warehouses: this.warehouses,
      discounts: this.discounts,
      total: this.getTotalRecords(),
      timestamp: this.timestamp.toISOString(),
    };
  }
}
