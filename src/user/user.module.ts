import { Module } from "@nestjs/common";
import { UsersController } from "./user.controller";
import { PrismaModule } from "src/database/prisma.module";
import { UserService } from "src/user/user.service";

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
