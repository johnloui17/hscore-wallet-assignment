import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from './wallet/wallet.module';
import { Wallet } from './wallet/entities/wallet.entity';
import { Transaction } from './wallet/entities/transaction.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE === 'sqlite' ? 'sqlite' : 'postgres',
      database: process.env.DB_TYPE === 'sqlite' ? 'database.sqlite' : 'wallet_db',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      entities: [Wallet, Transaction],
      synchronize: true, // Auto-create tables (for development)
    }),
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
