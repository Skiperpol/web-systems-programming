import { ApiProperty } from '@nestjs/swagger';

export class DiscountResponseDto {
  @ApiProperty({
    description: 'Unique discount identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Discount name',
    example: 'Summer Sale 2024',
  })
  name: string;

  @ApiProperty({
    description: 'Discount percentage (0-100)',
    example: 15,
  })
  percentage: number;

  @ApiProperty({
    description: 'Discount description',
    example: 'Special summer discount for all products',
  })
  description: string;

  @ApiProperty({
    description: 'Discount valid from date',
    example: '2024-06-01T00:00:00.000Z',
  })
  validFrom: Date;

  @ApiProperty({
    description: 'Discount valid to date',
    example: '2024-08-31T23:59:59.999Z',
  })
  validTo: Date;
}
