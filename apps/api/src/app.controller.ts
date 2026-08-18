import { Controller, Get, Headers } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(
    @Headers('x-user-id') userId: string,
    @Headers('x-email') email: string,
  ): string {
    console.log(`User ID: ${userId}`);
    console.log(`Email: ${email}`);
    return this.appService.getHello();
  }
}
