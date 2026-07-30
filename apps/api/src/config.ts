import { ConfigFactory, ConfigObject } from '@nestjs/config';

export interface AppConfig extends ConfigObject {
  app: {
    port?: number;
  };
}

export const configFactory: ConfigFactory<AppConfig> = () => {
  return {
    app: {
      port: Number.parseInt(process.env.PORT ?? '5600', 10),
    },
  };
};
