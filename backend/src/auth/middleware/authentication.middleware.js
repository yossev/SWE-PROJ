"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationMiddleware = AuthenticationMiddleware;
/* eslint-disable prettier/prettier */
// Enhanced Authentication Middleware
const unauthorized_exception_1 = require("@nestjs/common/exceptions/unauthorized.exception");
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
function AuthenticationMiddleware(req, res, next) {
    var _a, _b;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || ((_b = req.headers['authorization']) === null || _b === void 0 ? void 0 : _b.split(' ')[1]);
    if (!token) {
        throw new unauthorized_exception_1.UnauthorizedException('Authentication token missing');
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, String(process.env.JWT_SECRET));
        req['user'] = decoded.user; // Attach user payload to the request object
        next();
    }
    catch (err) {
        throw new unauthorized_exception_1.UnauthorizedException('Invalid or expired token');
    }
}
