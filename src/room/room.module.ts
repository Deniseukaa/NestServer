import { Module } from "@nestjs/common";
import { RoomsController } from "./room.controller";
import { PrismaModule } from "src/database/prisma.module";

@Module({
  controllers: [RoomsController],
  imports: [PrismaModule],
})
export class RoomModule {}
