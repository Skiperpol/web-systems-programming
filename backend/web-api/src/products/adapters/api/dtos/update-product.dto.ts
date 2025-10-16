import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Laptop Dell XPS 13',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 1299.99,
    minimum: 0.01,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly price?: number;

  @ApiProperty({
    description: 'Product description',
    example: 'High-performance laptop with 13-inch display',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;
}
