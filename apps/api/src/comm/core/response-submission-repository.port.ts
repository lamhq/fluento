import { ResponseSubmissionEntity } from './response-submission.entity';

export const RESPONSE_SUBMISSION_REPOSITORY = Symbol(
  'ResponseSubmissionRepository',
);

export interface ResponseSubmissionRepositoryPort {
  create(data: ResponseSubmissionEntity): Promise<ResponseSubmissionEntity>;
}
