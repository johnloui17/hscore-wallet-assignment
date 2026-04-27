import { Controller, Post, Get, Param, Body, Query, Delete } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TransactDto } from './dto/wallet.dto';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Controller('api/v1/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async create(@Body() createDto: CreateWalletDto) {
    return this.walletService.createWallet(createDto.name, createDto.initialBalance, createDto.userId);
  }

  @Get()
  async getAll(@Query('userId') userId?: string) {
    return this.walletService.getAllWallets(userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.walletService.deleteWallet(id);
  }

  @Get(':id')
  async getBalance(@Param('id') id: string) {
    return this.walletService.getBalance(id);
  }

  @Post(':id/credit')
  async credit(@Param('id') id: string, @Body() transactDto: TransactDto) {
    return this.walletService.credit(id, transactDto.amount, transactDto.category, transactDto.description);
  }

  @Post(':id/debit')
  async debit(@Param('id') id: string, @Body() transactDto: TransactDto) {
    return this.walletService.debit(id, transactDto.amount, transactDto.category, transactDto.description);
  }

  @Get(':id/history')
  async getHistory(
    @Param('id') id: string,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.walletService.getHistory(id, Number(limit), Number(offset));
  }

  @Get('transactions/all')
  async getAllTransactions(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sortBy') sortBy: 'date' | 'amount' = 'date',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
    @Query('walletId') walletId?: string | string[],
    @Query('userId') userId?: string,
  ) {
    const walletIds = Array.isArray(walletId) 
      ? walletId 
      : walletId ? walletId.split(',') : undefined;

    return this.walletService.getAllTransactions(
      Number(limit),
      Number(offset),
      type,
      category,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      walletIds,
      userId,
    );
  }
}
