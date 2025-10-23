#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module.js';
import { ISeederServicePort } from '../../domain/ports/i-seeder-service.port.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get<ISeederServicePort>('ISeederServicePort');

  const command = process.argv[2];

  try {
    switch (command) {
      case 'seed': {
        console.log('Starting database seeding...');
        const result = await seederService.seedDatabase();
        console.log('Database seeded successfully!');
        console.log(`Results:`);
        console.log(`   - Clients: ${result.clients}`);
        console.log(`   - Products: ${result.products}`);
        console.log(`   - Warehouses: ${result.warehouses}`);
        console.log(`   - Discounts: ${result.discounts}`);
        console.log(`   - Total: ${result.getTotalRecords()}`);
        console.log(`   - Timestamp: ${result.timestamp.toISOString()}`);
        break;
      }

      case 'clear':
        console.log('Clearing database...');
        await seederService.clearDatabase();
        console.log('Database cleared successfully!');
        break;

      case 'stats': {
        console.log('Getting database statistics...');
        const stats = await seederService.getDatabaseStats();
        console.log('Current database statistics:');
        console.log(`   - Clients: ${stats.clients}`);
        console.log(`   - Products: ${stats.products}`);
        console.log(`   - Warehouses: ${stats.warehouses}`);
        console.log(`   - Discounts: ${stats.discounts}`);
        console.log(`   - Total: ${stats.getTotalRecords()}`);
        console.log(`   - Is Empty: ${stats.isEmpty()}`);
        console.log(`   - Timestamp: ${stats.timestamp.toISOString()}`);
        break;
      }

      default:
        console.log('Unknown command. Available commands:');
        console.log('   seed   - Seed database with sample data');
        console.log('   clear  - Clear all data from database');
        console.log('   stats  - Show database statistics');
        console.log('');
        console.log('Usage: npm run seeder <command>');
        process.exit(1);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Error:', error);
    }
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
