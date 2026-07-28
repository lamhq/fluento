import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios';

export function createApiClient(config?: CreateAxiosDefaults): AxiosInstance {
  return axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
}
