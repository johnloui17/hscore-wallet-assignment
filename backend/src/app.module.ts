import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from './wallet/wallet.module';
import { Wallet } from './wallet/entities/wallet.entity';
import { Transaction } from './wallet/entities/transaction.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE === 'sqlite' ? 'sqlite' : 'postgres',
      database: process.env.DB_TYPE === 'sqlite' ? 'database.sqlite' : process.env.DB_NAME || 'wallet_db',
      ...(process.env.DB_TYPE !== 'sqlite' && {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        username: process.env.DB_USERNAME || 'user',
        password: process.env.DB_PASSWORD || 'password',
      }),
      entities: [Wallet, Transaction],
      synchronize: process.env.NODE_ENV !== 'production', // Safe for live
    }),
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
