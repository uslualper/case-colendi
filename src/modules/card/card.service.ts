import { Injectable } from '@nestjs/common';
import { CardCreate, CardUpdate } from './card.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Card, CardStatus } from '@prisma/client';
import { activeCardCondition } from './helpers/prisma.helper';
import { generateExpirationDate } from './helpers/generate.helper';
@Injectable()
export class CardService {
  constructor(private prisma: PrismaService) {}

  async getCards(userId: number, page?: number): Promise<Card[]> {
    return this.prisma.card.findMany({
      where: {
        userId,
        ...activeCardCondition(),
      },
      skip: page ? (page - 1) * 10 : 0,
      take: 10,
    });
  }

  async getCard(userId: number, id: number): Promise<Card> {
    return this.prisma.card.findFirst({
      where: {
        id,
        userId,
        ...activeCardCondition(),
      },
      include: {
        mccs: true,
      },
    });
  }

  async createCard(userId: number, data: CardCreate): Promise<Card> {
    return this.prisma.card.create({
      data: {
        cardNumber: data.cardNumber,
        expiration: generateExpirationDate(
          data.expirationYear,
          data.expirationMonth,
        ),
        cvv: data.cvv,
        userId: userId,
      },
    });
  }

  async updateCard(cardId: number, data: CardUpdate): Promise<Card> {
    return this.prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        expiration: generateExpirationDate(
          data.expirationYear,
          data.expirationMonth,
        ),
        cvv: data.cvv,
      },
    });
  }

  async cancelCard(cardId: number): Promise<Card> {
    return this.prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        status: CardStatus.CANCELLED,
      },
    });
  }

  async addMccToCard(cardId: number, mccId: number): Promise<Card> {
    return this.prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        mccs: {
          connect: {
            id: mccId,
          },
        },
      },
    });
  }
}
