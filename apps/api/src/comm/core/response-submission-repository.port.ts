import { ResponseSubmissionEntity } from './response-submission.entity';

export const RESPONSE_SUBMISSION_REPOSITORY_PORT = Symbol(
  'ResponseSubmissionRepositoryPort',
);

export interface ResponseSubmissionRepositoryPort {
  create(data: ResponseSubmissionEntity): Promise<ResponseSubmissionEntity>;
}
