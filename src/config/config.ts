import { Config } from './config.interface';

const config: Config = {
  nest: {
    port: Number(process.env.APP_PORT),
  },
  cors: {
    enabled: true,
  },
  security: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET || '',
    accessExpiresIn: '10m',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
