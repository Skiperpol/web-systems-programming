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

  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Product name cannot be empty.');
    }
    this.name = newName.trim();
  }

  public updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Price must be positive.');
    }
    this.price = newPrice;
  }

  public updateDescription(newDescription: string): void {
    if (!newDescription || newDescription.trim().length === 0) {
      throw new Error('Product description cannot be empty.');
    }
    this.description = newDescription.trim();
  }
}
