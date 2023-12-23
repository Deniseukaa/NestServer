import { Controller, Get, Param, ParseIntPipe, UseGuards, Body } from "@nestjs/common";
import { DormitoryService } from "src/dormitory/dormitory.service";
import { Prisma } from "@prisma/client";
import { JWTAuthGuard } from "src/auth/guards/jwt-auth.guard";

@UseGuards(JWTAuthGuard)
@Controller("dormitory")
export class DormitoryController {
  constructor(private dormitoryService: DormitoryService) {}

  @Get(":id/rooms")
  public async getRooms(@Param("id", ParseIntPipe) id: number) {
    return this.dormitoryService.getRoomsInDormitory(id);
  }

  @Get("dormitories")
  public async getDormitories(
    @Body()
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.DormitoryWhereUniqueInput;
      where?: Prisma.DormitoryWhereInput;
      orderBy?: Prisma.DormitoryOrderByWithRelationInput;
    },
  ) {
    console.log(12323);
    return this.dormitoryService.getDormitories(params);
  }
}
