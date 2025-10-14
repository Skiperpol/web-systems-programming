import { IsString, IsEmail } from 'class-validator';

export class CreateClientDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly phone: string;
}
