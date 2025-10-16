export class WarehouseModel {
  public id: string;
  public name: string;
  public address: string;
  public capacity: number;

  constructor(id: string, name: string, address: string, capacity: number) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.capacity = capacity;
  }

  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Warehouse name cannot be empty.');
    }
    this.name = newName.trim();
  }

  public updateAddress(newAddress: string): void {
    if (!newAddress || newAddress.trim().length === 0) {
      throw new Error('Warehouse address cannot be empty.');
    }
    this.address = newAddress.trim();
  }

  public updateCapacity(newCapacity: number): void {
    if (newCapacity <= 0) {
      throw new Error('Capacity must be positive.');
    }
    this.capacity = newCapacity;
  }
}
