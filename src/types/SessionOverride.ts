import 'express-session';

declare module 'express-session' {
  interface Session {
    connectedUser?: { id: number; name: string };
  }
}
