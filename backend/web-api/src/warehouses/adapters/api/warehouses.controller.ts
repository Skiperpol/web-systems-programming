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
import { CreateWarehouseDto } from './dtos/create-warehouse.dto.js';
import { UpdateWarehouseDto } from './dtos/update-warehouse.dto.js';
import { WarehouseResponseDto } from './dtos/warehouse-response.dto.js';
import { IWarehouseService } from '../../domain/ports/i-warehouses.service.js';

@ApiTags('warehouses')
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: IWarehouseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({
    status: 201,
    description: 'Warehouse created successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createWarehouseDto: CreateWarehouseDto,
  ): Promise<WarehouseResponseDto> {
    const warehouseModel =
      await this.warehouseService.create(createWarehouseDto);
    const responseDto = new WarehouseResponseDto();
    Object.assign(responseDto, warehouseModel);
    return responseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a warehouse by ID' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse found',
    type: WarehouseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async findOne(@Param('id') id: string): Promise<WarehouseResponseDto> {
    const warehouseModel = await this.warehouseService.findOne(id);

    const responseDto = new WarehouseResponseDto();
    Object.assign(responseDto, warehouseModel);
    return responseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  @ApiResponse({
    status: 200,
    description: 'List of all warehouses',
    type: [WarehouseResponseDto],
  })
  async findAll(): Promise<WarehouseResponseDto[]> {
    const models = await this.warehouseService.findAll();
    return models.map((model) => {
      const dto = new WarehouseResponseDto();
      Object.assign(dto, model);
      return dto;
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiBody({ type: UpdateWarehouseDto })
  @ApiResponse({
    status: 200,
    description: 'Warehouse updated successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<WarehouseResponseDto> {
    const updatedModel = await this.warehouseService.update(
      id,
      updateWarehouseDto,
    );

    const responseDto = new WarehouseResponseDto();
    Object.assign(responseDto, updatedModel);
    return responseDto;
  }

  @Put(':id/capacity')
  @ApiOperation({ summary: 'Update warehouse capacity' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        capacity: { type: 'number', description: 'New capacity' },
      },
      required: ['capacity'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Capacity updated successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async updateCapacity(
    @Param('id') id: string,
    @Body('capacity') newCapacity: number,
  ): Promise<WarehouseResponseDto> {
    const updatedModel = await this.warehouseService.updateCapacity(
      id,
      newCapacity,
    );

    const responseDto = new WarehouseResponseDto();
    Object.assign(responseDto, updatedModel);
    return responseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({ status: 204, description: 'Warehouse deleted successfully' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.warehouseService.delete(id);
  }
}
