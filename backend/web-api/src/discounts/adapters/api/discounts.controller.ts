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
import { CreateDiscountDto } from './dtos/create-discount.dto';
import { DiscountResponseDto } from './dtos/discount-response.dto';
import { IDiscountService } from '../../domain/ports/i-discounts.service';

@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: IDiscountService) {}

  @Post()
  async create(
    @Body() createDiscountDto: CreateDiscountDto,
  ): Promise<DiscountResponseDto> {
    const discountData = {
      ...createDiscountDto,
      validFrom: new Date(createDiscountDto.validFrom),
      validTo: new Date(createDiscountDto.validTo),
    };

    const discountModel = await this.discountService.create(discountData);
    const responseDto = new DiscountResponseDto();
    Object.assign(responseDto, discountModel);
    return responseDto;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DiscountResponseDto> {
    const discountModel = await this.discountService.findOne(id);

    const responseDto = new DiscountResponseDto();
    Object.assign(responseDto, discountModel);
    return responseDto;
  }

  @Get()
  async findAll(): Promise<DiscountResponseDto[]> {
    const models = await this.discountService.findAll();
    return models.map((model) => {
      const dto = new DiscountResponseDto();
      Object.assign(dto, model);
      return dto;
    });
  }

  @Put(':id/percentage')
  async updatePercentage(
    @Param('id') id: string,
    @Body('percentage') newPercentage: number,
  ): Promise<DiscountResponseDto> {
    const updatedModel = await this.discountService.updatePercentage(
      id,
      newPercentage,
    );

    const responseDto = new DiscountResponseDto();
    Object.assign(responseDto, updatedModel);
    return responseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.discountService.delete(id);
  }
}
