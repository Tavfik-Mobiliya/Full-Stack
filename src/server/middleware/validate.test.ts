import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validateBody } from "./validate";

describe("validateBody middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  const mockSchema = z.object({
    name: z.string().trim().min(2),
    age: z.number().int().positive(),
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

    const middleware = validateBody(mockSchema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
    expect(mockRequest.body).toEqual({
      name: "John Doe", // trimmed
      age: 30,
    });
  });

  it("should return 400 with details if validation fails with ZodError", () => {
    mockRequest.body = {
      name: "J", // too short
      age: -5,  // negative (invalid positive)
    };

    const middleware = validateBody(mockSchema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

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
    } as unknown as z.ZodSchema;

    mockRequest.body = { name: "Test" };

    const middleware = validateBody(errorThrowingSchema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
    expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({
      message: "Something else went wrong",
    }));
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});
