import { Global, Module } from '@nestjs/common';

import { CONTEXT_SERVICE } from './core/context.service';
import { NodeContextService } from './infrastructure/node-context.service';

@Global()
@Module({
  providers: [
    NodeContextService,
    {
      provide: CONTEXT_SERVICE,
      useExisting: NodeContextService,
    },
  ],
  exports: [NodeContextService, CONTEXT_SERVICE],
})
export class CommonModule {}
