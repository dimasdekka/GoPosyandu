import { prisma } from '../../config/db';
import { Prisma, User } from '@prisma/client';

export class AuthRepository {
  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username }
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async countAdmins(): Promise<number> {
    return prisma.user.count({ where: { role: 'ADMIN' } });
  }
}
