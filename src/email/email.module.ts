import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendgridClient } from './sendgrid-client';

@Module({
  providers: [EmailService, SendgridClient],
  exports: [EmailService],
})
export class EmailModule {}
