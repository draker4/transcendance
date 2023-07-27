/* eslint-disable prettier/prettier */
import { BadGatewayException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '@/users/users.service';
import { CryptoService } from '@/utils/crypto/crypto';
import * as bcrypt from 'bcrypt';
import { User } from '@/utils/typeorm/User.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private cryptoService: CryptoService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {

    let user: User;
    try {
      user = await this.usersService.getUserByEmail(email, 'email');
    } catch (error) {
      throw new BadGatewayException();
    }

    
    if (!user)
    throw new NotFoundException();
    
    const passDecrypted = await this.cryptoService.decrypt(password);
    const isMatch = await bcrypt.compare(passDecrypted, user.passwordHashed);

    if (!isMatch)
      throw new UnauthorizedException();

    if (!user.verified) {
      await this.authService.sendNewCode(user);
      throw new ForbiddenException();
    }

    return await this.usersService.saveUserEntity(user);
  }
}
