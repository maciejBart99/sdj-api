import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenPayload } from '@sdj/shared/auth/core/domain';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfigService } from '../../../core/application-services/src/lib/config/auth-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: AuthConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.secret,
    });
  }

  async validate(payload: TokenPayload): Promise<any> {
    return payload;
  }
}
