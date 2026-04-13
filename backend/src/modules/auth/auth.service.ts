import { AuthRepository } from './auth.repository';
import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  private repository = new AuthRepository();

  async login(username: string, passwordPlain: string) {
    const user = await this.repository.findByUsername(username);
    if (!user) {
      throw new Error('Username atau Password salah');
    }

    const isValid = await bcrypt.compare(passwordPlain, user.password);
    if (!isValid) {
      throw new Error('Username atau Password salah');
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      nama: user.nama
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'supers3cr3t',
      { expiresIn: '1d' }
    );

    return { user: payload, token };
  }

  async register(data: Prisma.UserCreateInput) {
    const existing = await this.repository.findByUsername(data.username);
    if (existing) {
      throw new Error('Username sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await this.repository.create({
      ...data,
      password: hashedPassword
    });

    return { id: result.id, username: result.username, role: result.role };
  }
}
