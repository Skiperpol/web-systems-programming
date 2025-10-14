import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Laptop Dell XPS 13',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 1299.99,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'High-performance laptop with 13-inch display',
  })
  @IsString()
  readonly description: string;
}
