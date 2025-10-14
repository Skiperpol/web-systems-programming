import { ApiProperty } from '@nestjs/swagger';

export class WarehouseResponseDto {
  @ApiProperty({
    description: 'Unique warehouse identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Warehouse name',
    example: 'Main Distribution Center',
  })
  name: string;

  @ApiProperty({
    description: 'Warehouse address',
    example: '123 Industrial Blvd, City, State 12345',
  })
  address: string;

  @ApiProperty({
    description: 'Warehouse capacity in square meters',
    example: 5000,
  })
  capacity: number;
}
