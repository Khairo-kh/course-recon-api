declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REDIS_URL: string;
      PORT: string;
      CONCORDIA_API_USERNAME: string;
      CONCORDIA_API_KEY: string;
      SESSION_SECRET: string;
    }
  }
}

export {}
