import { ConfigFactory, ConfigObject } from '@nestjs/config';

export interface AppConfig extends ConfigObject {
  app: {
    port?: number;
  };
  database: {
    url?: string;
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
  };
};
