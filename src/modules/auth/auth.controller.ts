import { Controller, Post, Body } from '@nestjs/common';
import { SingIn, SingUp, SingInResult, SingUpResult } from './auth.dto';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signIn')
  async signIn(@Body() user: SingIn): Promise<SingInResult> {
    const result = await this.authService.signIn(user);

    if (result) return result;
    throw new BadRequestException(
      'Could not log-in with the provided credentials',
    );
  }

  @Post('signUp')
  async signUp(@Body() user: SingUp): Promise<SingUpResult> {
    const result = await this.authService.signUp(user);

    if (result) return result;
    throw new BadRequestException(
      'Could not log-in with the provided credentials',
    );
  }
}
