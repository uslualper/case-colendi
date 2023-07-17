import { User as UserClient } from '@prisma/client';

export class User implements UserClient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  gpaId: number;
}
