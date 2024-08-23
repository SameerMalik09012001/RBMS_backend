"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong") {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApiError";
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map