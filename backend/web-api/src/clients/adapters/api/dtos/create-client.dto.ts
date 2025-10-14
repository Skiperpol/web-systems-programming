import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    description: 'Client first name',
    example: 'John',
  })
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    description: 'Client last name',
    example: 'Doe',
  })
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    description: 'Client email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'Client phone number',
    example: '+1234567890',
  })
  @IsString()
  readonly phone: string;
}
