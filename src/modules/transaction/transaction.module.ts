import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CardService } from '../card/card.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [TransactionController],
  providers: [PrismaService, TransactionService, CardService],
  exports: [TransactionService],
})
export class TransactionModule {}
