import { AppError } from "./error.middleware";

export const isAdminMiddleware = (req: any, res: any, next: any) => {
    if (req.user.role !== "ADMIN") {
        return next(new AppError("Access denied", 403));
    }
    next();
};