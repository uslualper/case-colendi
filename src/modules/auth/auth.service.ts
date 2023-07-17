import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { SingIn, SingInResult, SingUp, SingUpResult } from './auth.dto';
import { hashPassword, comparePassword } from './helpers/hash.helper';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(userData: SingIn): Promise<SingInResult> {
    const user = await this.userService.findByEmail(userData.email);
    if (await !comparePassword(userData.password, user.password)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    return {
      user: user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(userData: SingUp): Promise<SingUpResult> {
    const user = await this.userService.findByEmail(userData.email);
    if (user) {
      throw new UnauthorizedException();
    }

    const data: Prisma.UserCreateInput = {
      email: userData.email,
      password: await hashPassword(userData.password),
      firstName: userData.firstName,
      lastName: userData.lastName,
    };
    const newUser = await this.userService.createUser(data);
    const payload = { sub: newUser.id, email: newUser.email };
    return {
      user: newUser,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
