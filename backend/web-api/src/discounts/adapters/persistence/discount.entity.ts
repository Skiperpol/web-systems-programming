import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('discounts')
export class DiscountTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  percentage: number;

  @Column()
  description: string;

  @Column('timestamp')
  validFrom: Date;

  @Column('timestamp')
  validTo: Date;
}
