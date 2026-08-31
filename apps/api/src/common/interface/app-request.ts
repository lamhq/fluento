import { Request } from 'express';

export type AppRequest = Request & {
  userId?: string;
};
