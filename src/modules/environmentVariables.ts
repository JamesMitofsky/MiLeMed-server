const nodeEnv = process.env.NODE_ENV as
  | 'development'
  | 'production'
  | undefined;

export { nodeEnv };
