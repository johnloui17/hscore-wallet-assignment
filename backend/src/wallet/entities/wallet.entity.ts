import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', default: 'My Vault' })
  name: string;

  @Column('numeric', { precision: 15, scale: 2, default: 0 })
  balance: number;
}
