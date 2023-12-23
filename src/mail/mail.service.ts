import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { welcomeMailDto } from "src/mail/dto/mail.dto";

@Injectable()
export class MailService {
  constructor(@InjectQueue("Mail") private readonly mailQueue: Queue) {}

  async sendMail(mail: welcomeMailDto): Promise<void> {
    await this.mailQueue.add("send", mail);
  }
}
