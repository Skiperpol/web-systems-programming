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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateClientDto } from './dtos/create-client.dto';
import { ClientResponseDto } from './dtos/client-response.dto';
import { IClientService } from '../../domain/ports/i-clients.service';

@ApiTags('clients')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: IClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createClientDto: CreateClientDto,
  ): Promise<ClientResponseDto> {
    const clientModel = await this.clientService.create(createClientDto);
    const responseDto = new ClientResponseDto();
    Object.assign(responseDto, clientModel);
    return responseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({
    status: 200,
    description: 'Client found',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findOne(@Param('id') id: string): Promise<ClientResponseDto> {
    const clientModel = await this.clientService.findOne(id);

    const responseDto = new ClientResponseDto();
    Object.assign(responseDto, clientModel);
    return responseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({
    status: 200,
    description: 'List of all clients',
    type: [ClientResponseDto],
  })
  async findAll(): Promise<ClientResponseDto[]> {
    const models = await this.clientService.findAll();
    return models.map((model) => {
      const dto = new ClientResponseDto();
      Object.assign(dto, model);
      return dto;
    });
  }

  @Put(':id/email')
  @ApiOperation({ summary: 'Update client email' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', description: 'New email address' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Email updated successfully',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Client not found' })
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
  @ApiOperation({ summary: 'Delete a client' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({ status: 204, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.clientService.delete(id);
  }
}
