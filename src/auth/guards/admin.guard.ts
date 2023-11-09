import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdmin = this.reflector.get("isAdmin", context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user.role === "ADMIN" && isAdmin) return true;
    else throw new ForbiddenException("User does not have permission");
  }
}
