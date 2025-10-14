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
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { IProductService } from '../../domain/ports/i-products.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: IProductService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const productModel = await this.productService.create(createProductDto);
    const responseDto = new ProductResponseDto();
    Object.assign(responseDto, productModel);
    return responseDto;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const productModel = await this.productService.findOne(id);

    const responseDto = new ProductResponseDto();
    Object.assign(responseDto, productModel);
    return responseDto;
  }

  @Get()
  async findAll(): Promise<ProductResponseDto[]> {
    const models = await this.productService.findAll();
    return models.map((model) => {
      const dto = new ProductResponseDto();
      Object.assign(dto, model);
      return dto;
    });
  }

  @Put(':id/price')
  async updatePrice(
    @Param('id') id: string,
    @Body('price') newPrice: number,
  ): Promise<ProductResponseDto> {
    const updatedModel = await this.productService.updatePrice(id, newPrice);

    const responseDto = new ProductResponseDto();
    Object.assign(responseDto, updatedModel);
    return responseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.productService.delete(id);
  }
}
