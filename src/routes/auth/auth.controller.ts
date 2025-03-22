import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import jwt from "jsonwebtoken";
import ENVDATA from "../../lib/env-file";
import { authenticate, authenticateLocal } from "../../middleware/auth.middleware";
import { AppError } from "../../middleware/error.middleware";

class AuthController {
    router: Router;
    constructor() {
        this.router = Router();
        this.initializeRoutes();  
    }

    private initializeRoutes(): void {
        this.router.post('/signin', authenticateLocal,this.signinHandler);
        this.router.post('/signup', this.signup);
        this.router.get('/profile', authenticate, this.getProfile);
        this.router.post('/refresh-token', this.refreshToken);

        this.router.post('/reset-password', this.resetPassword);
        this.router.post('/verify-otp', this.verifyOtp);
        this.router.post('/update-password', this.updatePassword);

        this.router.post('/logout',authenticate, this.logout);
    }

    private async signinHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as any;
            const {accessToken, refreshToken}=AuthService.generateTokens(user);

            const isVerfied=await AuthService.signin(user.id);

            if(!isVerfied){
                throw new AppError("Please verify your account", 404);
            }

            res.cookie("substack-clone-accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            });

            res.cookie("substack-clone-refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            
            res.status(200).json({
                success: true,
                status: 200,
                message: "Login successful",
            });
        } catch (error) {
            next(error);
        }
    }

    private async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await AuthService.signup(req.body);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }    

    private refreshToken(req: Request, res: Response, next: NextFunction): void {
        try {
            const refreshToken = req.cookies["substack-clone-refreshToken"];
            if (!refreshToken) res.status(401).json({ message: "Unauthorized" });
    
            jwt.verify(refreshToken, ENVDATA.REFRESH_SECRET!, (err: any, decoded: any) => {
                if (err) res.status(403).json({ message: "Forbidden" });
    
                const user = { id: decoded.id };
                const { accessToken, refreshToken: newRefreshToken } = AuthService.generateTokens(user);
    
                res.cookie("substack-clone-accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000,
                });
    
                res.cookie("substack-clone-refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
    
                res.json({ success: true, status: 200, message: "Token refreshed successfully" });
            });
        } catch (error) {
            next(error);
        }
    }
    

    private async getProfile(req: Request, res: Response): Promise<void> {
        const { password, ...resUser } = req.user as any ?? {}
        res.json({ 
            success: true, 
            message: "Profile fetched successfully",
            data: { user: resUser }
        });
    }


    private async resetPassword(req: Request, res: Response,  next:NextFunction) : Promise<void> {
        try {
            const result=await AuthService.resetPassword(req.body.email);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    private async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await AuthService.verifyOtp(req.body);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    private async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await AuthService.updatePassword(req.body);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    private logout(req: Request, res: Response): void {
        res.clearCookie("substack-clone-accessToken");
        res.clearCookie("substack-clone-refreshToken");
        res.status(204).json({ success: true, message: "Logged out successfully" });
    }
}

export default new AuthController().router;