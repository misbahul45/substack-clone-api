// auth.middleware.ts
import passport from "../strategies/passport.strategy";
import { Request, Response, NextFunction } from 'express';
import { AppError } from "./error.middleware";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate("jwt", { session: false }, (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

        req.user = user;
        next();
    })(req, res, next);
}

export const authenticateLocal = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return next(new AppError(info?.message || 'Authentication failed', 401));
      }
      
      if(!user.isVerified) {
        return next(new AppError('User is not verified', 401));
      }
      
      req.user = user;
      return next();
    })(req, res, next);
  };