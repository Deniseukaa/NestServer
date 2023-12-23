import { MailerService } from "@nestjs-modules/mailer";
import { OnQueueActive, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { welcomeMailDto } from "./dto/mail.dto";

@Processor("Mail")
export class MailProcessor {
  constructor(private readonly mailService: MailerService) {}

  @Process("send")
  async sendWelcomeEmail(job: Job<welcomeMailDto>) {
    const { data } = job;
    await this.mailService.sendMail({
      to: data.to,
      subject: data.subject,
      template: `../templates/${data.template}`,
      context: {
        name: data.context.name,
      },
    });
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
  }
}
