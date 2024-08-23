class ApiError extends Error {
    statusCode: number;
    name:string;
    
    constructor(statusCode, message = "Something went wrong") {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApiError"; // Optional: for easier identification
    }
}

export { ApiError };
