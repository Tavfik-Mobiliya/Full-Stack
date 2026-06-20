import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware, AuthenticatedRequest } from "./authMiddleware";
import { env } from "../config/env";

describe("authMiddleware", () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      headers: {},
      cookies: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should return 401 if authorization header and session cookie are missing", () => {
    authMiddleware(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Unauthorized. Authentication token is missing.",
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should extract token from Bearer Authorization header", () => {
    const token = jwt.sign({ role: "admin" }, env.adminJwtSecret);
    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };

    authMiddleware(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockRequest.isAdmin).toBe(true);
    expect(nextFunction).toHaveBeenCalled();
  });

  it("should extract token from cookie if Authorization header is missing", () => {
    const token = jwt.sign({ role: "admin" }, env.adminJwtSecret);
    mockRequest.cookies = {
      [env.authCookieName]: token,
    };

    authMiddleware(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockRequest.isAdmin).toBe(true);
    expect(nextFunction).toHaveBeenCalled();
  });

  it("should return 401 if JWT verification fails", () => {
    mockRequest.headers = {
      authorization: "Bearer invalidtokenhere",
    };

    authMiddleware(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Unauthorized. Invalid or expired token.",
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return 403 if token is valid but role is not admin", () => {
    const token = jwt.sign({ role: "user" }, env.adminJwtSecret);
    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };

    authMiddleware(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Forbidden. Admin access is required.",
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
