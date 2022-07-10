import * as express from "express";
import { AuthService } from "../shared/auth/auth.service";
import { iocContainer } from './ioc';

export async function expressAuthentication(req: express.Request, name: string, scopes?: string[]): Promise<unknown> {
  if (name === 'features') {
    const authService = iocContainer(req).get<AuthService>(AuthService);
    return authService.authorize(req.headers['authorization'] ?? '', scopes);

  } else {
    throw new Error(`Unknown securityDefinitions ${name} not found. See tsoa.json for valid options`);
  }
}
