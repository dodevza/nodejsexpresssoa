import { Request, Response, NextFunction } from "express";
import { FieldErrors, ValidateError } from "tsoa";
import { BusinessRuleError } from "../shared/exceptions/business-rule.error";
import { NotFoundError } from "../shared/exceptions/notfound.error";
import { UnAuthenticatedError } from "../shared/exceptions/un-authenticated.error";
import { UnAuthorizedError } from "../shared/exceptions/un-authorized.error";
import { Logger } from "../shared/logging/logger";

export function exceptionHandler(err: unknown,
    req: Request,
    res: Response,
    next: NextFunction) {
    if (err instanceof ValidateError) {
        const message = err.message || "Validation Failed";
        Logger.warn(message, err.fields);
        return res.status(422).json({
            message: err.message || "Validation Failed",
            context: cleanErrorFields(err?.fields),
            reason: "invalid",
        })
    }

    if (err instanceof BusinessRuleError) {
        const message = err.message || "Business Rule Failed";
        Logger.warn(message, err.context);
        return res.status(422).json({
            message,
            context: err.context,
            reason: err.reason || "business_rule",
        })
    }

    if (err instanceof NotFoundError) {
        const message = err.message || "Unable to find resource";
        Logger.verbose(message);
        return res.status(404).json({ message });
    }

    if (err instanceof UnAuthorizedError) {
        const message = err.message || "Forbidden";
        Logger.warn(message);
        return res.status(403).json({ message });
    }

    if (err instanceof UnAuthenticatedError) {
        const message = err.message || "Forbidden";
        Logger.warn(message);
        return res.status(401).json({ message });
    }

    if (err instanceof Error) {
        Logger.error(`Exception: ${err.message}`, err.stack);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }

    next();
}

function cleanErrorFields(fields: FieldErrors): FieldErrors | undefined {
    if (!fields) return

    const newFields: FieldErrors = {};
    for(const key in fields) {
        const newKeyArray = replaceParameterNameForBodyObjects(key);
        newFields[newKeyArray] = fields[key];
    }
    return newFields;
}

function replaceParameterNameForBodyObjects(key: string): string {
    const newKeyArray = key.split('.');
        if (newKeyArray.length === 1) return newKeyArray[0];
    
    return newKeyArray.splice(1).join('.');
}