import { IsNumber, IsString, IsNotEmpty, Min, IsOptional } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  initialBalance?: number;
}
