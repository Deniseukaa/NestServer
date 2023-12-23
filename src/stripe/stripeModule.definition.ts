import { ConfigurableModuleBuilder } from "@nestjs/common";
import { StripeModuleOptions } from "./stripeModuleOptions.interface";

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<StripeModuleOptions>().build();
