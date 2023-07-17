import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [CardController],
  providers: [PrismaService, CardService],
  exports: [CardService],
})
export class CardModule {}
