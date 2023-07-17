import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/modules/auth/helpers/hash.helper';

const prisma = new PrismaClient();

async function main() {
  const merchant1 = await prisma.merchant.create({
    data: {
      MID: 'MID1',
      gpa: {
        create: {
          balance: 0,
        },
      },
      mcc: {
        create: {
          mccCode: '1234',
        },
      },
    },
  });

  const merchant2 = await prisma.merchant.create({
    data: {
      MID: 'MID2',
      gpa: {
        create: {
          balance: 0,
        },
      },
      mcc: {
        create: {
          mccCode: '5678',
        },
      },
    },
  });

  const gpa = await prisma.gpa.upsert({
    where: { id: 1 },
    update: {},
    create: {
      balance: 1000,
      users: {
        create: [
          {
            firstName: 'Alper',
            lastName: 'Uslu',
            email: 'uslualper@putlook.com',
            password: await hashPassword('123456'),
            cards: {
              create: [
                {
                  cardNumber: '1111111111111111',
                  expiration: new Date(),
                  cvv: 123,
                  status: 'ACTIVE',
                  mccs: {
                    create: [
                      {
                        mccCode: '1234',
                      },
                      {
                        mccCode: '5678',
                      },
                    ],
                  },
                  transactions: {
                    create: [
                      {
                        amount: 100,
                        merchant: {
                          connect: {
                            id: merchant1.id,
                          },
                        },
                      },
                      {
                        amount: 200,
                        merchant: {
                          connect: {
                            id: merchant2.id,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log({ gpa });
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
