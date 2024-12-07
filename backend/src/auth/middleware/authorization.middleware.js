"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable prettier/prettier */
// Enhanced Authorization Middleware
const common_1 = require("@nestjs/common");
/**
 * Role-Based Access Control (RBAC) Middleware
 * Checks if the user has access to the requested endpoint based on roles.
 * @param roles - Array of allowed roles (e.g., ['student', 'instructor', 'admin'])
 */
const isUserAuthorized = (roles) => {
    return (req, res, next) => {
        const user = res.locals.user; // Retrieve user from res.locals
        if (!user || !roles.includes(user.role)) {
            throw new common_1.UnauthorizedException('User does not have the required role');
        }
        next();
    };
};
exports.default = isUserAuthorized;
