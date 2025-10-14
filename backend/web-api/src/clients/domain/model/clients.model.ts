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

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
