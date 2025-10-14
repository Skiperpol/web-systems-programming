import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateClientDto } from './dtos/create-client.dto';
import { ClientResponseDto } from './dtos/client-response.dto';
import { IClientService } from '../../domain/ports/i-clients.service';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: IClientService) {}

  @Post()
  async create(
    @Body() createClientDto: CreateClientDto,
  ): Promise<ClientResponseDto> {
    const clientModel = await this.clientService.create(createClientDto);
    const responseDto = new ClientResponseDto();
    Object.assign(responseDto, clientModel);
    return responseDto;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ClientResponseDto> {
    const clientModel = await this.clientService.findOne(id);

    const responseDto = new ClientResponseDto();
    Object.assign(responseDto, clientModel);
    return responseDto;
  }

  @Get()
  async findAll(): Promise<ClientResponseDto[]> {
    const models = await this.clientService.findAll();
    return models.map((model) => {
      const dto = new ClientResponseDto();
      Object.assign(dto, model);
      return dto;
    });
  }

  @Put(':id/email')
  async updateEmail(
    @Param('id') id: string,
    @Body('email') newEmail: string,
  ): Promise<ClientResponseDto> {
    const updatedModel = await this.clientService.updateEmail(id, newEmail);

    const responseDto = new ClientResponseDto();
    Object.assign(responseDto, updatedModel);
    return responseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.clientService.delete(id);
  }
}
