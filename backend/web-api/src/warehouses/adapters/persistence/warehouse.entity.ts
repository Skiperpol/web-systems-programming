import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('warehouses')
export class WarehouseTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column('int')
  capacity: number;
}
