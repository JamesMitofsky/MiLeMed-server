import { Request } from 'express';

export interface MyContext {
  req: Request;
  connectedUser?: { id: number; name: string };
}
