import { Global, Module } from '@nestjs/common';

import { CONTEXT_SERVICE } from './context.service';
import { NodeContextService } from './node-context.service';

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
export class ContextModule {}
