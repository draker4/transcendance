/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from "express";

@Injectable()
export class JwtNoExpirationTimeStrategy extends PassportStrategy(
	Strategy,
	"jwtNoExpirationTime",
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtNoExpirationTimeStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'crunchy-token' in req.cookies &&
      req.cookies['crunchy-token'].length > 0
    ) {
      return req.cookies['crunchy-token'];
    }
    return null;
  }

  async validate(payload: any) {
    return { id: payload.sub, login: payload.login };
  }
}
