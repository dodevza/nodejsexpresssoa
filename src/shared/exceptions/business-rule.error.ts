export class BusinessRuleError extends Error {
    constructor(message: string, public reason: string, public context: unknown = null) {
        super(message);
        Object.setPrototypeOf(this, BusinessRuleError.prototype)
    }
}