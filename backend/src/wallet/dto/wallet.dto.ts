import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class TransactDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  category?: string;
}
