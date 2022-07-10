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
    server.use(express.static("public"));

    RegisterRoutes(server);

    server.use((_req, res: express.Response) => {
      Logger.verbose("Not Found", _req.url);
      res.status(404).json({
        message: "Not Found",
      });
    });

    server.use(exceptionHandler);

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

    return server;
}