import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { BullModule } from "@nestjs/bull";
import { MailProcessor } from "src/mail/mail.processor";

@Module({
  imports: [
    MailerModule,
    BullModule.registerQueueAsync({
      name: "Mail",
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
