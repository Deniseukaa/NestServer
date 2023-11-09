import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log("Successfully connected to DB");
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("Successfully disconnected from DB");
  }
}
