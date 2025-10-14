import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('clients')
export class ClientTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;
}
