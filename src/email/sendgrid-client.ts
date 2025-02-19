import { Injectable, Logger } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendgridClient {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(SendgridClient.name);
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async send(mail: SendGrid.MailDataRequired): Promise<void> {
    try {
      await SendGrid.send(mail);
    } catch (error) {
      this.logger.log(`Email successfully dispatched to ${mail.to as string}`);
      throw error;
    }
  }
}
