import { Prisma } from '@prisma/client';
import { CardStatus } from '@prisma/client';

export function activeCardCondition(): Prisma.CardWhereInput {
  return {
    status: CardStatus.ACTIVE,
  };
}

export function canceledCardCondition(): Prisma.CardWhereInput {
  return {
    status: CardStatus.CANCELLED,
  };
}
