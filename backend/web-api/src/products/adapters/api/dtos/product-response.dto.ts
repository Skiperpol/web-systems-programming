import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Unique product identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Laptop Dell XPS 13',
  })
  name: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 1299.99,
  })
  price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'High-performance laptop with 13-inch display',
  })
  description: string;
}
