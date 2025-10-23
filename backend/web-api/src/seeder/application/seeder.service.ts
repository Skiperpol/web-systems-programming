import { Injectable, Inject } from '@nestjs/common';
import { ISeederServicePort } from '../domain/ports/i-seeder-service.port.js';
import type { ISeederRepositoryPort } from '../domain/ports/i-seeder-repository.port.js';
import { SeederResultModel } from '../domain/model/seeder-result.model.js';
import { DatabaseStatsModel } from '../domain/model/database-stats.model.js';

@Injectable()
export class SeederService implements ISeederServicePort {
  constructor(
    @Inject('ISeederRepositoryPort')
    private readonly seederRepository: ISeederRepositoryPort,
  ) {}

  async seedDatabase(): Promise<SeederResultModel> {
    try {
      return await this.seederRepository.seedAll();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to seed database: ${error.message}`);
      } else {
        throw new Error(`Failed to seed database: ${String(error)}`);
      }
    }
  }

  async clearDatabase(): Promise<void> {
    try {
      await this.seederRepository.clearAllData();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to clear database: ${error.message}`);
      } else {
        throw new Error(`Failed to clear database: ${String(error)}`);
      }
    }
  }

  async getDatabaseStats(): Promise<DatabaseStatsModel> {
    try {
      return await this.seederRepository.getDatabaseStats();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get database stats: ${error.message}`);
      } else {
        throw new Error(`Failed to get database stats: ${String(error)}`);
      }
    }
  }
}
