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

  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Discount name cannot be empty.');
    }
    this.name = newName.trim();
  }

  public updatePercentage(newPercentage: number): void {
    if (newPercentage < 0 || newPercentage > 100) {
      throw new Error('Percentage must be between 0 and 100.');
    }
    this.percentage = newPercentage;
  }

  public updateDescription(newDescription: string): void {
    if (!newDescription || newDescription.trim().length === 0) {
      throw new Error('Discount description cannot be empty.');
    }
    this.description = newDescription.trim();
  }

  public updateValidFrom(newValidFrom: Date): void {
    if (!newValidFrom || isNaN(newValidFrom.getTime())) {
      throw new Error('Valid from date must be a valid date.');
    }
    this.validFrom = newValidFrom;
  }

  public updateValidTo(newValidTo: Date): void {
    if (!newValidTo || isNaN(newValidTo.getTime())) {
      throw new Error('Valid to date must be a valid date.');
    }
    if (this.validFrom && newValidTo < this.validFrom) {
      throw new Error('Valid to date must be after valid from date.');
    }
    this.validTo = newValidTo;
  }

  public isActive(): boolean {
    const now = new Date();
    return now >= this.validFrom && now <= this.validTo;
  }
}
