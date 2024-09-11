"use strict";
// src/middleware/authorizationMiddleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = authorizeRoles;
function authorizeRoles(...roles) {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (roles.includes(userRole)) {
            next();
        }
        else {
            res.sendStatus(403); // No permitido
        }
    };
}
