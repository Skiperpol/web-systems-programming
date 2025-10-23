import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { ISeederServicePort } from '../../domain/ports/i-seeder-service.port.js';

@ApiTags('Seeder')
@Controller('seeder')
export class SeederController {
  constructor(
    @Inject('ISeederServicePort')
    private readonly seederService: ISeederServicePort,
  ) {}

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Seed database with sample data' })
  @ApiResponse({
    status: 200,
    description: 'Database seeded successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            clients: {
              type: 'number',
              description: 'Number of clients created',
            },
            products: {
              type: 'number',
              description: 'Number of products created',
            },
            warehouses: {
              type: 'number',
              description: 'Number of warehouses created',
            },
            discounts: {
              type: 'number',
              description: 'Number of discounts created',
            },
            total: {
              type: 'number',
              description: 'Total number of records created',
            },
            timestamp: { type: 'string', description: 'Seeding timestamp' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during seeding',
  })
  async seedDatabase() {
    const result = await this.seederService.seedDatabase();
    return {
      message: 'Database seeded successfully',
      data: result.toJSON(),
    };
  }

  @Post('clear')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear all data from database' })
  @ApiResponse({
    status: 200,
    description: 'Database cleared successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during clearing',
  })
  async clearDatabase() {
    await this.seederService.clearDatabase();
    return {
      message: 'Database cleared successfully',
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get current database statistics' })
  @ApiResponse({
    status: 200,
    description: 'Database statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            clients: { type: 'number', description: 'Number of clients' },
            products: { type: 'number', description: 'Number of products' },
            warehouses: { type: 'number', description: 'Number of warehouses' },
            discounts: { type: 'number', description: 'Number of discounts' },
            total: { type: 'number', description: 'Total number of records' },
            isEmpty: {
              type: 'boolean',
              description: 'Whether database is empty',
            },
            timestamp: { type: 'string', description: 'Stats timestamp' },
          },
        },
      },
    },
  })
  async getStats() {
    const stats = await this.seederService.getDatabaseStats();
    return {
      message: 'Database statistics retrieved successfully',
      data: stats.toJSON(),
    };
  }
}
