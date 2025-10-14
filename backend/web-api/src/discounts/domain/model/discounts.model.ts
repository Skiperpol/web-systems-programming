export class DiscountModel {
  public id: string;
  public name: string;
  public percentage: number;
  public description: string;
  public validFrom: Date;
  public validTo: Date;

  constructor(
    id: string,
    name: string,
    percentage: number,
    description: string,
    validFrom: Date,
    validTo: Date,
  ) {
    this.id = id;
    this.name = name;
    this.percentage = percentage;
    this.description = description;
    this.validFrom = validFrom;
    this.validTo = validTo;
  }

  public updatePercentage(newPercentage: number): void {
    if (newPercentage < 0 || newPercentage > 100) {
      throw new Error('Percentage must be between 0 and 100.');
    }
    this.percentage = newPercentage;
  }

  public isActive(): boolean {
    const now = new Date();
    return now >= this.validFrom && now <= this.validTo;
  }
}
