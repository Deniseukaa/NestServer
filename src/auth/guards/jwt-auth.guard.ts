import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JWTAuthGuard extends AuthGuard("jwt") {
  handleRequest(_, user) {
    if (!user) {
      throw new UnauthorizedException("Invalid JWT Token");
    }
    return user;
  }
}
