import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({
    description: 'Warehouse name',
    example: 'Main Distribution Center',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Warehouse address',
    example: '123 Industrial Blvd, City, State 12345',
  })
  @IsString()
  readonly address: string;

  @ApiProperty({
    description: 'Warehouse capacity in square meters',
    example: 5000,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  readonly capacity: number;
}
