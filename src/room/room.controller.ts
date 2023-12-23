import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { JWTAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RoomService } from "src/room/room.service";

@UseGuards(JWTAuthGuard)
@Controller("rooms")
export class RoomsController {
  constructor(private readonly roomService: RoomService) {}

  @Get("/user")
  async getRoomViaUserEmail(@Query("id", ParseIntPipe) id: number) {
    return this.roomService.getRoomViaUserId(id);
  }

  @Get("/:id")
  async getRoom(@Param("id", ParseIntPipe) id: number) {
    console.log(1);
    return this.roomService.getRoom({ id });
  }
}
