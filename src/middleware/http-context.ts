import { Lifecycle, scoped } from "tsyringe";
import { Request  } from "express";


/**
 * Asumes the middleware will create a childContainer and then attach the current request header and params details to this service 
 */
@scoped(Lifecycle.ContainerScoped)
export class HttpContextService {
    private headers: Record<string, string | string[]> | null = null;
    setContext(req: Request) {
        this.headers = Object.assign({}, req.headers) as Record<string, string | string[]>;
    }

    getHeaders(): Record<string, string | string[]> {
        return (this.headers ?? {}) as Record<string, string | string[]>
    }
}
