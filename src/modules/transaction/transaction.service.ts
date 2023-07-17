import { Injectable } from '@nestjs/common';
import {
  Card,
  CardTransaction,
  Gpa,
  Merchant,
  TransactionStatus,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  TransactionLimitScope,
  TransactionDeposit,
  TransactionSpend,
  TransactionSpendVerify,
} from './transaction.dto';
import { generateExpirationDate } from '../card/helpers/generate.helper';
import { activeCardCondition } from '../card/helpers/prisma.helper';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async getMerchantsByCardMccIds(mccIds: number[]): Promise<Merchant> {
    return await this.prisma.merchant.findFirst({
      where: {
        mccId: {
          in: mccIds,
        },
      },
    });
  }

  async checkCardScope(
    transaction: TransactionLimitScope,
  ): Promise<false | Card> {
    const card = await this.prisma.card.findFirst({
      where: {
        cardNumber: transaction.cardNumber,
        expiration: generateExpirationDate(
          transaction.expirationYear,
          transaction.expirationMonth,
        ),
        cvv: transaction.cvv,
        ...activeCardCondition(),
      },
      include: {
        mccs: true,
      },
    });

    if (!card) {
      return false;
    }

    if (!card.mccs || card.mccs.length === 0) {
      return card;
    }

    const merchant = await this.getMerchantsByCardMccIds(
      card.mccs.map((mcc) => mcc.id),
    );

    if (!merchant) {
      return false;
    }

    return card;
  }

  async deposit(
    userId: number,
    transaction: TransactionDeposit,
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        gpa: true,
      },
    });

    if (!user || !user.gpa) {
      return false;
    }

    const updatedGpa = await this.prisma.gpa.update({
      where: {
        id: user.gpa.id,
      },
      data: {
        balance: {
          increment: transaction.amount,
        },
      },
    });

    return !!updatedGpa;
  }

  async checkGpaBalance(userId: number, amount: number): Promise<false | Gpa> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        gpa: true,
      },
    });

    if (!user || !user.gpa) {
      return false;
    }

    if (user.gpa.balance < amount) {
      return false;
    }

    return user.gpa;
  }

  async spend(
    userId: number,
    transaction: TransactionSpend,
  ): Promise<false | CardTransaction> {
    const card = await this.checkCardScope(transaction);
    const gpa = await this.checkGpaBalance(userId, transaction.amount);

    if (!card || !gpa) {
      return false;
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        gpa: true,
      },
    });

    if (!user || !user.gpa) {
      return false;
    }

    return await this.prisma.cardTransaction.create({
      data: {
        amount: transaction.amount,
        code: '1234', // FIXME: for test
        card: {
          connect: {
            id: card.id,
          },
        },
        merchant: {
          connect: {
            id: transaction.merchantId,
          },
        },
      },
    });
  }

  async spendVerify(
    transactionId: number,
    transaction: TransactionSpendVerify,
  ): Promise<false | CardTransaction> {
    const cardTransaction = await this.prisma.cardTransaction.findUnique({
      where: {
        id: transactionId,
        code: transaction.code,
      },
      include: {
        card: true,
      },
    });

    if (!cardTransaction) {
      return false;
    }

    const gpa = await this.checkGpaBalance(
      cardTransaction.card.userId,
      cardTransaction.amount,
    );

    if (!gpa) {
      return false;
    }

    const updatedGpa = await this.prisma.gpa.update({
      where: {
        id: gpa.id,
      },
      data: {
        balance: {
          decrement: cardTransaction.amount,
        },
      },
    });

    if (!updatedGpa) {
      return false;
    }

    return await this.prisma.cardTransaction.update({
      where: {
        id: cardTransaction.id,
      },
      data: {
        status: TransactionStatus.COMPLETED,
      },
    });
  }
}
