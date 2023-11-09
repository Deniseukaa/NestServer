import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { AuthService } from "src/auth/auth.service";
import { Admin } from "src/auth/decorators/admin-user.decorator";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@CurrentUser() user: User): Promise<{ access_token: string }> {
    return this.authService.login(user);
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() signUp: Prisma.UserCreateInput): Promise<User> {
    return this.authService.register(signUp);
  }

  @Get("me")
  @Admin()
  @HttpCode(HttpStatus.OK)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
