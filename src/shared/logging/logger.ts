import { StdoutLogger } from "./stdout.logger";

export interface ILogger {
    error(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    info(message: string, ...args: unknown[]): void;
    verbose(message: string, ...args: unknown[]): void;
}

export class Logger {
    private static internal: ILogger;
    
    static initialize(logger?: ILogger) {
        Logger.internal = logger ?? new StdoutLogger();
    }

    static error(message: string, ...args: unknown[]): void {
        Logger.internal?.error(message, ...args);
    }
    static warn(message: string, ...args: unknown[]): void {
        Logger.internal?.warn(message, ...args);
    }
    static info(message: string, ...args: unknown[]): void {
        Logger.internal?.info(message, ...args);
    }
    static verbose(message: string, ...args: unknown[]): void {
        Logger.internal?.verbose(message, ...args);
    }
}