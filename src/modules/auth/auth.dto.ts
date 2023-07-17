import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.model';

export class SingUp {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
}

export class SingIn {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class UpdatePasswordInput {
  @ApiProperty()
  oldPassword: string;
  @ApiProperty()
  newPassword: string;
}

export class UpdateUserInput {
  @ApiProperty()
  email?: string;
  @ApiProperty()
  password?: UpdatePasswordInput;
  @ApiProperty()
  enabled?: boolean;
}

export class SingUpResult {
  user: User;
  access_token: string;
}

export class SingInResult {
  user: User;
  access_token: string;
}
