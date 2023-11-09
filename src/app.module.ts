import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserModule } from "./user/user.module";
import { RoomModule } from "./room/room.module";
import { DormitoryModule } from "./dormitory/dormitory.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [UserModule, RoomModule, DormitoryModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
