import axios, { type AxiosInstance } from 'axios';

import {
  paginatedExerciseSchema,
  paginatedPracticeExerciseSchema,
  practiceAttemptSchema,
} from './schemas';
import type { CursorPaginatedResponse } from './types';
import type {
  ApiClient,
  Exercise,
  ExerciseQuery,
  OffsetPaginatedResponse,
  PracticeAttempt,
  PracticeExercise,
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
      type: selectPracticeType(exercise.format),
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

  async getExercises(
    options: ExerciseQuery = {},
  ): Promise<OffsetPaginatedResponse<Exercise>> {
    const params = options;
    const response = await this.httpClient.get<unknown>('/v1/manage/exercises', {
      params,
    });

    const data = paginatedExerciseSchema.parse(response.data);
    return data;
  }
}
