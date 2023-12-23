import { Controller, Get, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { JWTAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { PaymentService } from "src/payment/payment.service";
import { StripeService } from "src/stripe/stripe.service";

@UseGuards(JWTAuthGuard)
@Controller("payment")
export class PaymentController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get("/prices")
  async getPrices() {
    console.log(1);
    return this.paymentService.getSubscriptionsPrice();
  }

  @Get("/subscribe")
  async subscribe(@CurrentUser() user: User) {
    return this.paymentService.createSubscription(user.email);
  }

  @Get("/details")
  async subscriptionDetails(@CurrentUser() user: User) {
    return this.paymentService.getSubscriptionDetails(user.email);
  }

  @Get("/cancel")
  async cancel(@CurrentUser() user: User) {
    return this.paymentService.cancelSubscription(user.email);
  }
}
