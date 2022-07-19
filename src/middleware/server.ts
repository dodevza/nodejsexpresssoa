import express from 'express';
import cors from "cors";
import {Express} from 'express-serve-static-core';
import swaggerUi from "swagger-ui-express";
import morgan from 'morgan';
import { RegisterRoutes } from "./routes";
import { exceptionHandler } from './exception-handler';
import { Logger } from '../shared/logging/logger';

function getCorsConfig() {
  return cors();
}
export async function createServer(): Promise<Express> {
    const server = express()
    const corsConfig = getCorsConfig();
    server.use(cors()); // TODO: Add Allow List
    server.options('*', corsConfig);
    server.use(express.json());
    server.use(morgan("tiny"));
    if (process.env.VIRTUAL_PATH) {
      server.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const regex = new RegExp(`^(.*)${process.env.VIRTUAL_PATH}\\/+(.*)$`, "ig");
        req.url = req.url.replace(regex, "$1$2");
        next();
      })
    }
    server.use(express.static("public"));

    RegisterRoutes(server);

    // Swagger
    server.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(undefined, {
          swaggerOptions: {
            url: "../swagger.json",
          },
        })
      );

      server.use((_req, res: express.Response) => {
        Logger.verbose("Not Found", _req.url);
        res.status(404).json({
          message: "Not Found",
        });
      });
  
      server.use(exceptionHandler);

    return server;
}