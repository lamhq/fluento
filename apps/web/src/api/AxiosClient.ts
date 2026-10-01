import axios, { type AxiosInstance } from 'axios';

import type {
  ApiClient,
  Exercise,
  PaginatedResponse,
  PracticeAttempt,
  PracticeExercise,
} from './types';
import { getPracticeType } from './utils';

export default class AxiosClient implements ApiClient {
  private readonly httpClient: AxiosInstance;

  constructor({ baseUrl }: { baseUrl: string }) {
    this.httpClient = axios.create({ baseURL: baseUrl });
  }

  setAccessToken(token: string) {
    this.httpClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  async getPracticeExercise() {
    const response = await this.httpClient.get<PaginatedResponse<PracticeExercise>>(
      '/v1/practice/exercises',
      {
        params: {
          sort: '-practicedAt',
          limit: 1,
        },
      },
    );

    const items = response.data.items.map((exercise) => {
      return { ...exercise, type: getPracticeType(exercise.format) };
    });

    return { ...response.data, items };
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

    return result.data;
  }

  async getExercises(
    options: {
      scenario?: string;
      topics?: string[];
      status?: 'active' | 'archived' | 'all';
      sort?: string;
      offset?: number;
      limit?: number;
    } = {},
  ): Promise<[number, Exercise[]]> {
    const params = options;
    const response = await this.httpClient.get<{
      total: number;
      items: Exercise[];
    }>('/v1/manage/exercises', {
      params,
    });

    return [response.data.total, response.data.items];
  }
}
