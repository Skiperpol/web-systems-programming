import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWarehouseDto {
  @ApiProperty({
    description: 'Warehouse name',
    example: 'Main Warehouse',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    description: 'Warehouse address',
    example: '123 Main St, City, Country',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly address?: string;

  @ApiProperty({
    description: 'Warehouse capacity',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly capacity?: number;
}