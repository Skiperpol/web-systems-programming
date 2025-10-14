export class ProductModel {
  public id: string;
  public name: string;
  public price: number;
  public description: string;

  constructor(id: string, name: string, price: number, description: string) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
  }

  public updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Price must be positive.');
    }
    this.price = newPrice;
  }
}
