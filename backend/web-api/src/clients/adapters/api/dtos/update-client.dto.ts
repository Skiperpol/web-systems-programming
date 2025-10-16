import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientDto {
  @ApiProperty({
    description: 'Client first name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiProperty({
    description: 'Client last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiProperty({
    description: 'Client email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({
    description: 'Client phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly phone?: string;
}
