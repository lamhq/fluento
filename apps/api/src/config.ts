import { ConfigFactory, ConfigObject } from '@nestjs/config';

export interface AppConfig extends ConfigObject {
  app: {
    port?: number;
  };
  database: {
    url?: string;
  };
  openai: {
    apiKey?: string;
  };
  langsmith: {
    tracing?: boolean;
    endpoint?: string;
    apiKey?: string;
    project?: string;
  };
}

export const configFactory: ConfigFactory<AppConfig> = () => {
  return {
    app: {
      port: Number.parseInt(process.env.PORT ?? '5600', 10),
    },
    database: {
      url: process.env.DATABASE_URL,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    langsmith: {
      tracing: process.env.LANGSMITH_TRACING === 'true',
      endpoint: process.env.LANGSMITH_ENDPOINT,
      apiKey: process.env.LANGSMITH_API_KEY,
      project: process.env.LANGSMITH_PROJECT,
    },
  };
};
