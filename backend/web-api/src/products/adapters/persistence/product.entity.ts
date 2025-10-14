import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('products')
export class ProductTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  description: string;
}
