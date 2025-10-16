import { IsString, IsNumber, IsOptional, Min, Max, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDiscountDto {
  @ApiProperty({
    description: 'Discount name',
    example: 'Summer Sale',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    description: 'Discount percentage',
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  readonly percentage?: number;

  @ApiProperty({
    description: 'Discount description',
    example: 'Summer sale with 20% off',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    description: 'Valid from date',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly validFrom?: string;

  @ApiProperty({
    description: 'Valid to date',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly validTo?: string;
}
