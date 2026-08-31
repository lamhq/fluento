import { ResponseSubmissionEntity } from './response-submission.entity';

export const RESPONSE_SUBMISSION_REPOSITORY = Symbol(
  'ResponseSubmissionRepository',
);

export interface ResponseSubmissionRepository {
  create(data: ResponseSubmissionEntity): Promise<ResponseSubmissionEntity>;
}
