import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { JWTAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserService } from "src/user/user.service";
@UseGuards(JWTAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get("/:id")
  async getUserById(@Param("id", ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }
}
