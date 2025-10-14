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
import { CreateDiscountDto } from './dtos/create-discount.dto';
import { DiscountResponseDto } from './dtos/discount-response.dto';
import { IDiscountService } from '../../domain/ports/i-discounts.service';

@ApiTags('discounts')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: IDiscountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new discount' })
  @ApiResponse({
    status: 201,
    description: 'Discount created successfully',
    type: DiscountResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
  @ApiOperation({ summary: 'Get a discount by ID' })
  @ApiParam({ name: 'id', description: 'Discount ID' })
  @ApiResponse({
    status: 200,
    description: 'Discount found',
    type: DiscountResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Discount not found' })
  async findOne(@Param('id') id: string): Promise<DiscountResponseDto> {
    const discountModel = await this.discountService.findOne(id);

    const responseDto = new DiscountResponseDto();
    Object.assign(responseDto, discountModel);
    return responseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Get all discounts' })
  @ApiResponse({
    status: 200,
    description: 'List of all discounts',
    type: [DiscountResponseDto],
  })
  async findAll(): Promise<DiscountResponseDto[]> {
    const models = await this.discountService.findAll();
    return models.map((model) => {
      const dto = new DiscountResponseDto();
      Object.assign(dto, model);
      return dto;
    });
  }

  @Put(':id/percentage')
  @ApiOperation({ summary: 'Update discount percentage' })
  @ApiParam({ name: 'id', description: 'Discount ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        percentage: { type: 'number', description: 'New percentage (0-100)' },
      },
      required: ['percentage'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Percentage updated successfully',
    type: DiscountResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Discount not found' })
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
  @ApiOperation({ summary: 'Delete a discount' })
  @ApiParam({ name: 'id', description: 'Discount ID' })
  @ApiResponse({ status: 204, description: 'Discount deleted successfully' })
  @ApiResponse({ status: 404, description: 'Discount not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.discountService.delete(id);
  }
}
