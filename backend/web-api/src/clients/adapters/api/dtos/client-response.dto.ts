import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty({
    description: 'Unique client identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Client first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Client last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Client email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Client phone number',
    example: '+1234567890',
  })
  phone: string;
}
