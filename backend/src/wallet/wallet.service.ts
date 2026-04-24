import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction, TransactionType } from './entities/transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async createWallet(name: string, initialBalance: number = 0): Promise<Wallet> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = queryRunner.manager.create(Wallet, { name, balance: initialBalance });
      await queryRunner.manager.save(wallet);

      if (initialBalance > 0) {
        const transaction = queryRunner.manager.create(Transaction, {
          wallet_id: wallet.id,
          amount: initialBalance,
          type: TransactionType.CREDIT,
        });
        await queryRunner.manager.save(transaction);
      }

      await queryRunner.commitTransaction();
      return wallet;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllWallets(): Promise<Wallet[]> {
    return this.walletRepository.find();
  }

  async deleteWallet(id: string): Promise<void> {
    const result = await this.walletRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Wallet not found');
    }
  }

  async getBalance(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { id } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async credit(id: string, amount: number, category?: string): Promise<Wallet> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isSqlite = this.dataSource.options.type === 'sqlite';
      const lockOptions = isSqlite ? undefined : { mode: 'pessimistic_write' as any };

      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { id },
        lock: lockOptions,
      });

      if (!wallet) throw new NotFoundException('Wallet not found');

      wallet.balance = Number(wallet.balance) + amount;
      
      const transaction = queryRunner.manager.create(Transaction, {
        wallet_id: id,
        amount,
        type: TransactionType.CREDIT,
        category: category || undefined
      });

      await queryRunner.manager.save(wallet);
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return wallet;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async debit(id: string, amount: number, category?: string): Promise<Wallet> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isSqlite = this.dataSource.options.type === 'sqlite';
      const lockOptions = isSqlite ? undefined : { mode: 'pessimistic_write' as any };

      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { id },
        lock: lockOptions,
      });

      if (!wallet) throw new NotFoundException('Wallet not found');

      if (Number(wallet.balance) < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      wallet.balance = Number(wallet.balance) - amount;
      
      const transaction = queryRunner.manager.create(Transaction, {
        wallet_id: id,
        amount,
        type: TransactionType.DEBIT,
        category: category || undefined
      });

      await queryRunner.manager.save(wallet);
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return wallet;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getHistory(id: string, limit = 10, offset = 0): Promise<{ transactions: Transaction[], total: number }> {
    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { wallet_id: id },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
    return { transactions, total };
  }
}
