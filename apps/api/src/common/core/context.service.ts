export const CONTEXT_SERVICE = Symbol('ContextService');

export interface ContextService {
  getUserId(): string | undefined;
  getUserIdOrThrow(): string;
}
