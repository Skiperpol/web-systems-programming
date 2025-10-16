export class ClientModel {
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public phone: string;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
  }

  public updateFirstName(newFirstName: string): void {
    if (!newFirstName || newFirstName.trim().length === 0) {
      throw new Error('First name cannot be empty.');
    }
    this.firstName = newFirstName.trim();
  }

  public updateLastName(newLastName: string): void {
    if (!newLastName || newLastName.trim().length === 0) {
      throw new Error('Last name cannot be empty.');
    }
    this.lastName = newLastName.trim();
  }

  public updateEmail(newEmail: string): void {
    if (
      !newEmail.includes('@') ||
      newEmail.indexOf('@') === 0 ||
      newEmail.indexOf('@') === newEmail.length - 1
    ) {
      throw new Error('Email must contain @ symbol.');
    }
    this.email = newEmail;
  }

  public updatePhone(newPhone: string): void {
    if (!newPhone || newPhone.trim().length === 0) {
      throw new Error('Phone number cannot be empty.');
    }
    this.phone = newPhone.trim();
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
