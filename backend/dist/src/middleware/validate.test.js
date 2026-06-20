"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validate_1 = require("./validate");
describe("validateBody middleware", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction = jest.fn();
    const mockSchema = zod_1.z.object({
        name: zod_1.z.string().trim().min(2),
        age: zod_1.z.number().int().positive(),
    });
    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFunction = jest.fn();
    });
    it("should call next() and update req.body if validation succeeds", () => {
        mockRequest.body = {
            name: "  John Doe  ",
            age: 30,
        };
        const middleware = (0, validate_1.validateBody)(mockSchema);
        middleware(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toHaveBeenCalledWith();
        expect(mockRequest.body).toEqual({
            name: "John Doe", // trimmed
            age: 30,
        });
    });
    it("should return 400 with details if validation fails with ZodError", () => {
        mockRequest.body = {
            name: "J", // too short
            age: -5, // negative (invalid positive)
        };
        const middleware = (0, validate_1.validateBody)(mockSchema);
        middleware(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: "Validation error",
            details: [
                { path: "name", message: "String must contain at least 2 character(s)" },
                { path: "age", message: "Number must be greater than 0" },
            ],
        });
        expect(nextFunction).not.toHaveBeenCalled();
    });
    it("should propagate other non-Zod errors to next()", () => {
        const errorThrowingSchema = {
            parse: () => {
                throw new Error("Something else went wrong");
            },
        };
        mockRequest.body = { name: "Test" };
        const middleware = (0, validate_1.validateBody)(errorThrowingSchema);
        middleware(mockRequest, mockResponse, nextFunction);
        expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
        expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({
            message: "Something else went wrong",
        }));
        expect(mockResponse.status).not.toHaveBeenCalled();
    });
});
