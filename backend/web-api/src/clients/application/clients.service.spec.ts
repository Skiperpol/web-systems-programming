import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ClientService } from './clients.service';
import { IClientRepository } from '../domain/ports/i-clients.repository';
import { ClientModel } from '../domain/model/clients.model';

describe('ClientService', () => {
  let service: ClientService;
  let repository: jest.Mocked<IClientRepository>;

  const mockClient = new ClientModel(
    'test-id',
    'John',
    'Doe',
    'john.doe@example.com',
    '+1234567890',
  );

  beforeEach(async () => {
    const mockRepository = {
      save: jest.fn((client) => client as ClientModel),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: IClientRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    repository = module.get(IClientRepository);
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const clientData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      };

      repository.save.mockResolvedValue(mockClient);

      const result = await service.create(clientData as any);

      expect(result).toEqual(mockClient);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a client when found', async () => {
      repository.findById.mockResolvedValue(mockClient);

      const result = await service.findOne('test-id');

      expect(result).toEqual(mockClient);
      expect(repository.findById).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException when client not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Client with ID non-existent-id not found',
      );
    });
  });

  describe('update', () => {
    it('should update all client fields', async () => {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+9876543210',
      };

      const updatedClient = new ClientModel(
        'test-id',
        'Jane',
        'Smith',
        'jane.smith@example.com',
        '+9876543210',
      );

      repository.findById.mockResolvedValue(mockClient);
      repository.save.mockResolvedValue(updatedClient);

      const result = await service.update('test-id', updateData);

      expect(result).toEqual(updatedClient);
      expect(repository.findById).toHaveBeenCalledWith('test-id');
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+9876543210',
        }),
      );
    });

    it('should update only firstName', async () => {
      const updateData = { firstName: 'Jane' };
      const updatedClient = new ClientModel(
        'test-id',
        'Jane',
        'Doe',
        'john.doe@example.com',
        '+1234567890',
      );

      repository.findById.mockResolvedValue(mockClient);
      repository.save.mockResolvedValue(updatedClient);

      const result = await service.update('test-id', updateData);

      expect(result).toEqual(updatedClient);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
        }),
      );
    });

    it('should update only lastName', async () => {
      const updateData = { lastName: 'Smith' };
      const updatedClient = new ClientModel(
        'test-id',
        'John',
        'Smith',
        'john.doe@example.com',
        '+1234567890',
      );

      repository.findById.mockResolvedValue(mockClient);
      repository.save.mockResolvedValue(updatedClient);

      const result = await service.update('test-id', updateData);

      expect(result).toEqual(updatedClient);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          lastName: 'Smith',
        }),
      );
    });

    it('should update only email', async () => {
      const updateData = { email: 'new.email@example.com' };
      const updatedClient = new ClientModel(
        'test-id',
        'John',
        'Doe',
        'new.email@example.com',
        '+1234567890',
      );

      repository.findById.mockResolvedValue(mockClient);
      repository.save.mockResolvedValue(updatedClient);

      const result = await service.update('test-id', updateData);

      expect(result).toEqual(updatedClient);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new.email@example.com',
        }),
      );
    });

    it('should update only phone', async () => {
      const updateData = { phone: '+9876543210' };
      const updatedClient = new ClientModel(
        'test-id',
        'John',
        'Doe',
        'john.doe@example.com',
        '+9876543210',
      );

      repository.findById.mockResolvedValue(mockClient);
      repository.save.mockResolvedValue(updatedClient);

      const result = await service.update('test-id', updateData);

      expect(result).toEqual(updatedClient);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          phone: '+9876543210',
        }),
      );
    });

    it('should update multiple fields', async () => {
      const updateData = {
        firstName: 'Jane',
        email: 'jane.doe@example.com',
      };
      const updatedClient = new ClientModel(
        'test-id',
        'Jane',
        'Doe',
        'jane.doe@example.com',
        '+1234567890',
      );

      repository.findById.mockResolvedValue(mockClient);
      repository.save.mockResolvedValue(updatedClient);

      const result = await service.update('test-id', updateData);

      expect(result).toEqual(updatedClient);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          email: 'jane.doe@example.com',
        }),
      );
    });

    it('should handle empty update data', async () => {
      const updateData = {};

      repository.findById.mockResolvedValue(mockClient);
      repository.save.mockResolvedValue(mockClient);

      const result = await service.update('test-id', updateData);

      expect(result).toEqual(mockClient);
      expect(repository.findById).toHaveBeenCalledWith('test-id');
      expect(repository.save).toHaveBeenCalledWith(mockClient);
    });

    it('should throw NotFoundException when client not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { firstName: 'Jane' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle firstName validation errors', async () => {
      repository.findById.mockResolvedValue(mockClient);

      await expect(
        service.update('test-id', { firstName: '' }),
      ).rejects.toThrow('First name cannot be empty.');
    });

    it('should handle lastName validation errors', async () => {
      repository.findById.mockResolvedValue(mockClient);

      await expect(service.update('test-id', { lastName: '' })).rejects.toThrow(
        'Last name cannot be empty.',
      );
    });

    it('should handle email validation errors', async () => {
      repository.findById.mockResolvedValue(mockClient);

      await expect(
        service.update('test-id', { email: 'invalid-email' }),
      ).rejects.toThrow('Email must contain @ symbol.');
    });

    it('should handle phone validation errors', async () => {
      repository.findById.mockResolvedValue(mockClient);

      await expect(service.update('test-id', { phone: '' })).rejects.toThrow(
        'Phone number cannot be empty.',
      );
    });
  });

  describe('updateEmail', () => {
    it('should update client email', async () => {
      const updatedClient = new ClientModel(
        'test-id',
        'John',
        'Doe',
        'new.email@example.com',
        '+1234567890',
      );

      repository.findById.mockResolvedValue(mockClient);
      repository.save.mockResolvedValue(updatedClient);

      const result = await service.updateEmail(
        'test-id',
        'new.email@example.com',
      );

      expect(result).toEqual(updatedClient);
      expect(repository.findById).toHaveBeenCalledWith('test-id');
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new.email@example.com',
        }),
      );
    });

    it('should throw NotFoundException when client not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.updateEmail('non-existent-id', 'new@example.com'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle domain validation errors', async () => {
      repository.findById.mockResolvedValue(mockClient);

      await expect(
        service.updateEmail('test-id', 'invalid-email'),
      ).rejects.toThrow('Email must contain @ symbol.');
    });
  });
});
