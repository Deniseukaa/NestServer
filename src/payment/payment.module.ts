import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { StripeModule } from "src/stripe/stripe.module";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    StripeModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>("STRIPE_SECRET"),
        options: {
          apiVersion: "2023-10-16",
        },
      }),
    }),
    ConfigModule,
    UserModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
