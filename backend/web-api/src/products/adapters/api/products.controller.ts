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
import { CreateProductDto } from './dtos/create-product.dto.js';
import { UpdateProductDto } from './dtos/update-product.dto.js';
import { ProductResponseDto } from './dtos/product-response.dto.js';
import { IProductService } from '../../domain/ports/i-products.service.js';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: IProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const productModel = await this.productService.create(createProductDto);
    const responseDto = new ProductResponseDto();
    Object.assign(responseDto, productModel);
    return responseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product found',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const productModel = await this.productService.findOne(id);

    const responseDto = new ProductResponseDto();
    Object.assign(responseDto, productModel);
    return responseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    type: [ProductResponseDto],
  })
  async findAll(): Promise<ProductResponseDto[]> {
    const models = await this.productService.findAll();
    return models.map((model) => {
      const dto = new ProductResponseDto();
      Object.assign(dto, model);
      return dto;
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const updatedModel = await this.productService.update(id, updateProductDto);

    const responseDto = new ProductResponseDto();
    Object.assign(responseDto, updatedModel);
    return responseDto;
  }

  @Put(':id/price')
  @ApiOperation({ summary: 'Update product price' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        price: { type: 'number', description: 'New price' },
      },
      required: ['price'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Price updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
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
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.productService.delete(id);
  }
}
