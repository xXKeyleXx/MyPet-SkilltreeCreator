import { APP_VERSION } from '../version';

export const environment = {
  production: true,
  sentry: true,
  providers: [],
  websocketUrl: location.host,
  version: 'PROD-' + APP_VERSION,
};
