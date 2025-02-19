import { Injectable } from '@nestjs/common';
import { SendgridClient } from './sendgrid-client';
import { MailDataRequired } from '@sendgrid/mail';

type TemplateData = {
  code: string;
  email: string;
};

@Injectable()
export class EmailService {
  constructor(private readonly sendGridClient: SendgridClient) {}

  async sendMail(recipient: string, subject: string, body: string) {
    const mail: MailDataRequired = {
      to: recipient,
      from: process.env.SENDGRID_SENDER_EMAIL!,
      subject,
      content: [{ type: 'text/plain', value: body }],
    };
    await this.sendGridClient.send(mail);
  }

  async sendEmailWithTemplateAuthCode(
    recipient: string,
    template: TemplateData,
  ) {
    const mail: MailDataRequired = {
      to: recipient,
      from: process.env.SENDGRID_SENDER_EMAIL!,
      templateId: process.env.SENDGRID_TEMPLATE_AUTH_CODE,
      dynamicTemplateData: template,
      content: [{ type: 'text/html', value: template.code }],
    };
    await this.sendGridClient.send(mail);
  }
}
