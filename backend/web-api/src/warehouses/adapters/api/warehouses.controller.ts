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
import { CreateWarehouseDto } from './dtos/create-warehouse.dto';
import { WarehouseResponseDto } from './dtos/warehouse-response.dto';
import { IWarehouseService } from '../../domain/ports/i-warehouses.service';

@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: IWarehouseService) {}

  @Post()
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
  async findOne(@Param('id') id: string): Promise<WarehouseResponseDto> {
    const warehouseModel = await this.warehouseService.findOne(id);

    const responseDto = new WarehouseResponseDto();
    Object.assign(responseDto, warehouseModel);
    return responseDto;
  }

  @Get()
  async findAll(): Promise<WarehouseResponseDto[]> {
    const models = await this.warehouseService.findAll();
    return models.map((model) => {
      const dto = new WarehouseResponseDto();
      Object.assign(dto, model);
      return dto;
    });
  }

  @Put(':id/capacity')
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
  async delete(@Param('id') id: string): Promise<void> {
    await this.warehouseService.delete(id);
  }
}
