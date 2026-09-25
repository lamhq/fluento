import axios, { type AxiosInstance } from 'axios';

import type {
  ApiClient,
  ExerciseResponseDto,
  PaginatedPracticeExercises,
  SubmitResponse,
} from './types';
import { PaginatedPracticeExercisesSchema, SubmitResponseSchema } from './types';

export default class AxiosClient implements ApiClient {
  private readonly httpClient: AxiosInstance;

  constructor({ baseUrl }: { baseUrl: string }) {
    this.httpClient = axios.create({ baseURL: baseUrl });
  }

  setAccessToken(token: string) {
    this.httpClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  async getPracticeExercise(): Promise<PaginatedPracticeExercises> {
    const response = await this.httpClient.get<PaginatedPracticeExercises>(
      '/v1/practice/exercises',
      {
        params: {
          sort: '-practicedAt',
          limit: 1,
        },
      },
    );

    const parsed = PaginatedPracticeExercisesSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error('Invalid exercise response from server.');
    }

    return parsed.data;
  }

  async submitPracticeResponse(
    exerciseId: string,
    response: string,
  ): Promise<SubmitResponse> {
    const result = await this.httpClient.post<SubmitResponse>(
      `/v1/practice/exercises/${exerciseId}/responses`,
      { response },
    );

    const parsed = SubmitResponseSchema.safeParse(result.data);
    if (!parsed.success) {
      throw new Error('Invalid response feedback from server.');
    }

    return parsed.data;
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
  ): Promise<[number, ExerciseResponseDto[]]> {
    const params = options;
    const response = await this.httpClient.get<{
      total: number;
      items: ExerciseResponseDto[];
    }>('/v1/manage/exercises', {
      params,
    });

    return [response.data.total, response.data.items];
  }
}
