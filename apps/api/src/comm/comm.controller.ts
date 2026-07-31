import { Controller, Get } from '@nestjs/common';

import { CommService } from './comm.service';

@Controller('demo')
export class CommController {
  constructor(private readonly commService: CommService) {}

  @Get('crud')
  async runCrudDemo(): Promise<void> {
    await this.commService.runExerciseCrudDemo();
  }
}
