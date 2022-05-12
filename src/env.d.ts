declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REDIS_URL: string;
      PORT: string;
      CONCORDIA_API_USERNAME: string;
      CONCORDIA_API_KEY: string;
      CONCORDIA_API_BASE_URL: string;
      SESSION_SECRET: string;
      ORIGIN_CORS: string;
    }
  }
}

export {};
