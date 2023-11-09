import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "src/auth/auth.service";
import { JwtPayload } from "src/auth/interfaces/jwt-payload.interface";
import { UserRequest } from "src/auth/interfaces/user.req.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.APP_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<UserRequest> {
    return this.authService.verifyPayload(payload);
  }
}
