import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CardCreate {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(16, 16)
  cardNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Length(3, 3)
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
}

export class CardUpdate {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Length(3, 3)
  cvv?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  expirationMonth?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(new Date().getFullYear())
  expirationYear?: number;
}

export class MccCreate {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  mccId: number;
}
