import axios, { type AxiosInstance } from 'axios';

import type { Exercise } from '../core/types/exercise';
import { exerciseSchema, paginatedExerciseSchema } from '../core/types/exercise';
import type { PracticeAttempt } from '../core/types/practice-attempt';
import { practiceAttemptSchema } from '../core/types/practice-attempt';
import type { PracticeExercise } from '../core/types/practice-exercise';
import { paginatedExerciseSchema as paginatedPracticeExerciseSchema } from '../core/types/practice-exercise';
import { topicSchema } from '../core/types/topic';
import type { CursorPaginatedResponse } from './types';
import type {
  ApiClient,
  CreateExerciseInput,
  ExerciseQuery,
  OffsetPaginatedResponse,
} from './types';
import { selectPracticeType } from './utils';

export default class AxiosClient implements ApiClient {
  private readonly httpClient: AxiosInstance;

  constructor({ baseUrl }: { baseUrl: string }) {
    this.httpClient = axios.create({ baseURL: baseUrl });
  }

  setAccessToken(token: string) {
    this.httpClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  async getPracticeExercise() {
    const response = await this.httpClient.get<
      CursorPaginatedResponse<PracticeExercise>
    >('/v1/practice/exercises', {
      params: {
        sort: 'practicedAt',
        limit: 1,
      },
    });

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
    const result = await this.httpClient.post<PracticeAttempt>(
      `/v1/practice/exercises/${exerciseId}/responses`,
      { practiceType, response },
    );
    return practiceAttemptSchema.parse(result.data);
  }

  async getTopics(signal?: AbortSignal) {
    const response = await this.httpClient.get<unknown>('/v1/practice/topics', {
      signal,
    });

    return topicSchema.array().parse(response.data);
  }

  async getExercises(
    options: ExerciseQuery = {},
    signal?: AbortSignal,
  ): Promise<OffsetPaginatedResponse<Exercise>> {
    const params = options;
    const response = await this.httpClient.get<unknown>('/v1/manage/exercises', {
      params,
      paramsSerializer: { indexes: null },
      signal,
    });

    const data = paginatedExerciseSchema.parse(response.data);
    return data;
  }

  async createExercise(input: CreateExerciseInput): Promise<Exercise> {
    const response = await this.httpClient.post<unknown>(
      '/v1/manage/exercises',
      input,
    );

    return exerciseSchema.parse(response.data);
  }
}
