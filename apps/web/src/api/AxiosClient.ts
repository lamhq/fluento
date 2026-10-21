import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

import type { Exercise } from '../core/types/exercise';
import { exerciseSchema } from '../core/types/exercise';
import type { ExerciseSummary } from '../core/types/exercise-summary';
import {
  exerciseSummarySchema,
  paginatedExerciseSummarySchema,
} from '../core/types/exercise-summary';
import type { PracticeAttempt } from '../core/types/practice-attempt';
import { practiceAttemptSchema } from '../core/types/practice-attempt';
import type { PracticeExercise } from '../core/types/practice-exercise';
import { paginatedExerciseSchema as paginatedPracticeExerciseSchema } from '../core/types/practice-exercise';
import { topicSchema } from '../core/types/topic';
import {
  type FieldErrors,
  ForbiddenError,
  FormError,
  NetworkError,
  NotFoundError,
  ServerError,
  UnAuthorizedError,
} from '../error-new/types';
import type { CursorPaginatedResponse } from './types';
import type {
  ApiClient,
  CreateExerciseInput,
  ExerciseQuery,
  OffsetPaginatedResponse,
  UpdateExerciseInput,
} from './types';
import { selectPracticeType } from './utils';

function isFormError(data: unknown): data is { details: FieldErrors } {
  return (
    data !== null &&
    typeof data === 'object' &&
    'details' in data &&
    data.details !== null &&
    typeof data.details === 'object' &&
    !Array.isArray(data.details)
  );
}

export default class AxiosClient implements ApiClient {
  private readonly httpClient: AxiosInstance;

  constructor({ baseUrl }: { baseUrl: string }) {
    this.httpClient = axios.create({ baseURL: baseUrl });
  }

  private async request<T>(
    request: Promise<AxiosResponse<T>>,
  ): Promise<AxiosResponse<T>> {
    try {
      return await request;
    } catch (error) {
      if (!axios.isAxiosError<unknown>(error)) {
        throw error;
      }

      if (axios.isCancel(error)) {
        throw error;
      }

      const { response } = error;
      if (!response) {
        throw new NetworkError();
      }

      switch (response.status) {
        case 400: {
          if (isFormError(response.data)) {
            throw new FormError(response.data.details);
          }
          break;
        }
        case 401:
          throw new UnAuthorizedError();
        case 403:
          throw new ForbiddenError();
        case 404:
          throw new NotFoundError();
        case 500:
          throw new ServerError();
        default:
          break;
      }

      throw error;
    }
  }

  setAccessToken(token: string) {
    this.httpClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  async getPracticeExercise() {
    const response = await this.request(
      this.httpClient.get<CursorPaginatedResponse<PracticeExercise>>(
        '/v1/practice/exercises',
        {
          params: {
            sort: 'practicedAt',
            limit: 1,
          },
        },
      ),
    );

    const data = paginatedPracticeExerciseSchema.parse(response.data);
    const items = data.items.map((exercise) => ({
      ...exercise,
      // randomly select practice type for each exercise
      type: selectPracticeType(exercise),
    }));
    return { ...data, items };
  }

  async submitPracticeResponse(
    exerciseId: string,
    practiceType: PracticeExercise['type'],
    response: string,
  ): Promise<PracticeAttempt> {
    const result = await this.request(
      this.httpClient.post<PracticeAttempt>(
        `/v1/practice/exercises/${exerciseId}/responses`,
        { practiceType, response },
      ),
    );
    return practiceAttemptSchema.parse(result.data);
  }

  async getTopics(signal?: AbortSignal) {
    const response = await this.request(
      this.httpClient.get<unknown>('/v1/practice/topics', {
        signal,
      }),
    );

    return topicSchema.array().parse(response.data);
  }

  async getExerciseById(
    exerciseId: string,
    signal?: AbortSignal,
  ): Promise<Exercise> {
    const response = await this.request(
      this.httpClient.get<unknown>(`/v1/manage/exercises/${exerciseId}`, { signal }),
    );

    return exerciseSchema.parse(response.data);
  }

  async getExercises(
    options: ExerciseQuery = {},
    signal?: AbortSignal,
  ): Promise<OffsetPaginatedResponse<ExerciseSummary>> {
    const params = options;
    const response = await this.request(
      this.httpClient.get<unknown>('/v1/manage/exercises', {
        params,
        paramsSerializer: { indexes: null },
        signal,
      }),
    );

    const data = paginatedExerciseSummarySchema.parse(response.data);
    return data;
  }

  async createExercise(input: CreateExerciseInput): Promise<ExerciseSummary> {
    const response = await this.request(
      this.httpClient.post<unknown>('/v1/manage/exercises', input),
    );

    return exerciseSummarySchema.parse(response.data);
  }

  async updateExercise(
    exerciseId: string,
    input: UpdateExerciseInput,
  ): Promise<ExerciseSummary> {
    const response = await this.request(
      this.httpClient.put<unknown>(`/v1/manage/exercises/${exerciseId}`, input),
    );

    return exerciseSummarySchema.parse(response.data);
  }
}
