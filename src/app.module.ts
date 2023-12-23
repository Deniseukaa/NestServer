import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserModule } from "./user/user.module";
import { RoomModule } from "./room/room.module";
import { DormitoryModule } from "./dormitory/dormitory.module";
import { AuthModule } from "./auth/auth.module";
import { PaymentModule } from "./payment/payment.module";
import { BullModule } from "@nestjs/bull";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  imports: [
    UserModule,
    RoomModule,
    DormitoryModule,
    AuthModule,
    PaymentModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: "gmail",
          auth: {
            user: configService.get("GMAIL"),
            pass: configService.get("GMAIL_PASS"),
          },
        },
        template: {
          dir: join(__dirname, "templates"),
          adapter: new HandlebarsAdapter(),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_URI"),
          port: configService.get("REDIS_PORT"),
          password: configService.get("REDIS_PASS"),
        },
        maxRetriesPerRequest: 3,
        defaultJobOptions: {
          attempts: 3,
          removeOnComplete: false,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
