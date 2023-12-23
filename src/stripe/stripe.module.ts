import { Module } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { ConfigurableModuleClass } from "src/stripe/stripeModule.definition";
import { ConfigModule } from "@nestjs/config";

@Module({
  providers: [StripeService],
  exports: [StripeService],
  imports: [ConfigModule],
})
export class StripeModule extends ConfigurableModuleClass {}
