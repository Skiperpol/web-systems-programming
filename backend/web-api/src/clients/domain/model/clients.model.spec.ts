import { ClientModel } from './clients.model';

describe('ClientModel', () => {
  let client: ClientModel;

  beforeEach(() => {
    client = new ClientModel(
      'test-id',
      'John',
      'Doe',
      'john.doe@example.com',
      '+1234567890',
    );
  });

  describe('constructor', () => {
    it('should create a client with correct properties', () => {
      expect(client.id).toBe('test-id');
      expect(client.firstName).toBe('John');
      expect(client.lastName).toBe('Doe');
      expect(client.email).toBe('john.doe@example.com');
      expect(client.phone).toBe('+1234567890');
    });
  });

  describe('updateEmail', () => {
    it('should update email when new email contains @ symbol', () => {
      const newEmail = 'new.email@example.com';
      client.updateEmail(newEmail);
      expect(client.email).toBe(newEmail);
    });

    it('should update email with valid email formats', () => {
      const validEmails = [
        'user@domain.com',
        'user.name@domain.co.uk',
        'user+tag@domain.org',
        'user123@domain123.net',
      ];

      validEmails.forEach((email) => {
        client.updateEmail(email);
        expect(client.email).toBe(email);
      });
    });

    it('should throw error when email does not contain @ symbol', () => {
      const invalidEmails = [
        'invalid-email',
        'user.domain.com',
        '@domain.com',
        'user@',
        '',
      ];

      invalidEmails.forEach((email) => {
        expect(() => client.updateEmail(email)).toThrow(
          'Email must contain @ symbol.',
        );
        expect(client.email).toBe('john.doe@example.com'); // Original email unchanged
      });
    });

    it('should allow email with @ symbol at the beginning', () => {
      const email = '@domain.com';
      expect(() => client.updateEmail(email)).toThrow(
        'Email must contain @ symbol.',
      );
    });
  });

  describe('getFullName', () => {
    it('should return full name combining first and last name', () => {
      expect(client.getFullName()).toBe('John Doe');
    });

    it('should handle names with spaces', () => {
      const clientWithSpaces = new ClientModel(
        'test-id',
        'Mary Jane',
        'Watson Smith',
        'mary@example.com',
        '+1234567890',
      );
      expect(clientWithSpaces.getFullName()).toBe('Mary Jane Watson Smith');
    });

    it('should handle empty names', () => {
      const clientWithEmptyNames = new ClientModel(
        'test-id',
        '',
        '',
        'empty@example.com',
        '+1234567890',
      );
      expect(clientWithEmptyNames.getFullName()).toBe(' ');
    });
  });
});
