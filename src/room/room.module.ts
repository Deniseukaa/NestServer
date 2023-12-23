import { Module } from "@nestjs/common";
import { RoomsController } from "./room.controller";
import { PrismaModule } from "src/database/prisma.module";
import { RoomService } from "src/room/room.service";

@Module({
  controllers: [RoomsController],
  imports: [PrismaModule],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
