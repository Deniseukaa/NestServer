import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { DormitoryService } from "src/dormitory/dormitory.service";

@Controller("dormitory")
export class DormitoryController {
  constructor(private dormitoryService: DormitoryService) {}

  @Get(":id/rooms")
  public async getRooms(@Param("id", ParseIntPipe) id: number) {
    return this.dormitoryService.getRoomsInDormitory(id);
  }
}
