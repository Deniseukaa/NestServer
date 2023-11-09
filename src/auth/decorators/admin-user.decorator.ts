import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { AdminGuard } from "src/auth/guards/admin.guard";
import { JWTAuthGuard } from "src/auth/guards/jwt-auth.guard";

export function Admin() {
  return applyDecorators(SetMetadata("isAdmin", true), UseGuards(JWTAuthGuard, AdminGuard));
}
