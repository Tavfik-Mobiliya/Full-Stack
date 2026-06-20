"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("./authMiddleware");
const env_1 = require("../config/env");
describe("authMiddleware", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction = jest.fn();
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
        (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: "Unauthorized. Authentication token is missing.",
        });
        expect(nextFunction).not.toHaveBeenCalled();
    });
    it("should extract token from Bearer Authorization header", () => {
        const token = jsonwebtoken_1.default.sign({ role: "admin" }, env_1.env.adminJwtSecret);
        mockRequest.headers = {
            authorization: `Bearer ${token}`,
        };
        (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(mockRequest.isAdmin).toBe(true);
        expect(nextFunction).toHaveBeenCalled();
    });
    it("should extract token from cookie if Authorization header is missing", () => {
        const token = jsonwebtoken_1.default.sign({ role: "admin" }, env_1.env.adminJwtSecret);
        mockRequest.cookies = {
            [env_1.env.authCookieName]: token,
        };
        (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(mockRequest.isAdmin).toBe(true);
        expect(nextFunction).toHaveBeenCalled();
    });
    it("should return 401 if JWT verification fails", () => {
        mockRequest.headers = {
            authorization: "Bearer invalidtokenhere",
        };
        (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: "Unauthorized. Invalid or expired token.",
        });
        expect(nextFunction).not.toHaveBeenCalled();
    });
    it("should return 403 if token is valid but role is not admin", () => {
        const token = jsonwebtoken_1.default.sign({ role: "user" }, env_1.env.adminJwtSecret);
        mockRequest.headers = {
            authorization: `Bearer ${token}`,
        };
        (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: "Forbidden. Admin access is required.",
        });
        expect(nextFunction).not.toHaveBeenCalled();
    });
});
