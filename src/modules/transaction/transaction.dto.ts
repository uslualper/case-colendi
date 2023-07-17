import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max, Length } from 'class-validator';
export class TransactionLimitScope {
  @ApiProperty()
  @IsNotEmpty()
  @Length(16, 16)
  cardNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 3)
  @IsNumber()
  cvv: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(12)
  expirationMonth: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(new Date().getFullYear())
  expirationYear: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  merchantId: number;
}

export class TransactionDeposit {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;
}

export class TransactionSpend extends TransactionLimitScope {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;
}

export class TransactionSpendVerify {
  @ApiProperty()
  @IsNotEmpty()
  @Min(4)
  code: string;
}
