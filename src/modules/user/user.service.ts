import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async find(id: number): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        cards: true,
        gpa: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(data: any): Promise<User> {
    const gpa = await this.prisma.gpa.create({
      data: {
        balance: 0,
      },
    });

    return this.prisma.user.create({
      data: {
        ...data,
        gpa: {
          connect: {
            id: gpa.id,
          },
        },
      },
    });
  }
}
