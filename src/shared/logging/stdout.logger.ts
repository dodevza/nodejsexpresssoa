import { ILogger } from "./logger";

export class StdoutLogger implements ILogger {

    error(message: string, ...args: unknown[]): void {
        console.error(message, ...args);
    }
    warn(message: string, ...args: unknown[]): void {
        console.warn(message, ...args);
    }
    info(message: string, ...args: unknown[]): void {
        console.info(message, ...args);
    }
    verbose(message: string, ...args: unknown[]): void {
        console.debug(message, ...args);
    }

}