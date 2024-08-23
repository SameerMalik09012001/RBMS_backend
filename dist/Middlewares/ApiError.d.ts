declare class ApiError extends Error {
    statusCode: number;
    name: string;
    constructor(statusCode: any, message?: string);
}
export { ApiError };
