import { Module } from "@nestjs/common";
import { DormitoryController } from "./dormitory.controller";
import { DormitoryService } from "src/dormitory/dormitory.service";
import { PrismaModule } from "src/database/prisma.module";

@Module({
  controllers: [DormitoryController],
  providers: [DormitoryService],
  imports: [PrismaModule],
})
export class DormitoryModule {}
