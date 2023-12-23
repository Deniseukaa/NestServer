import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StripeService } from "src/stripe/stripe.service";
import { UserService } from "../user/user.service";

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async getSubscriptionsPrice() {
    return this.stripeService.stripe.prices.list();
  }

  async createUserCredentials(email: string) {
    const user = await this.userService.getUser({
      email,
    });
    if (user.stripeId !== null) {
      throw new HttpException("User with a given email has credentials exists", 409);
    }
    const customer = await this.stripeService.stripe.customers.create({
      email,
    });
    await this.userService.updateUser({
      where: {
        email,
      },
      data: {
        stripeId: customer.id,
      },
    });
    return this.stripeService.stripe.customers.create({
      email,
    });
  }

  async createSubscription(email: string) {
    const user = await this.userService.getUser({
      email,
    });
    const subscription = await this.stripeService.stripe.subscriptions.create({
      customer: user.stripeId,
      items: [
        {
          price: this.configService.get("STRIPE_PRICE_ID"),
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
    await this.userService.updateUser({
      where: {
        stripeId: user.stripeId,
      },
      data: {
        subscriptionId: subscription.id,
      },
    });
    // @ts-ignore: Suppress errors on the next line
    return { customerID: user.stripeId, subscription: subscription.latest_invoice.payment_intent.client_secret };
  }

  async getSubscriptionDetails(email: string) {
    console.log(2);
    const user = await this.userService.getUser({
      email,
    });
    if (user.subscriptionId === null) {
      throw new HttpException("User with a given email has credentials exists", 409);
    }
    console.log(2);
    return this.stripeService.stripe.subscriptions.retrieve(user.subscriptionId);
  }

  async cancelSubscription(stripeId: string) {
    return this.stripeService.stripe.subscriptions.cancel(stripeId);
  }

  async resumeSubscription(stripeId: string) {
    const subscription = await this.getSubscriptionDetails(stripeId);
    return this.stripeService.stripe.subscriptions.resume(subscription.id, {
      billing_cycle_anchor: "now",
    });
  }
  async updateSubscription(stripeId: string) {
    return this.stripeService.stripe.subscriptions.update(stripeId);
  }
}
