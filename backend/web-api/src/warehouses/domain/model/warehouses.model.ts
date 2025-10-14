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

  public updateCapacity(newCapacity: number): void {
    if (newCapacity <= 0) {
      throw new Error('Capacity must be positive.');
    }
    this.capacity = newCapacity;
  }
}
