import { NextFunction, Router } from "express";
import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { AppError } from "../../middleware/error.middleware";
class UsersController{
    public router:Router;
    constructor(){
        this.router=Router();
        this.initializeRoutes();
    }

    private initializeRoutes():void{
        this.router.get("/:id", this.getUser);
        this.router.get("/", this.getAllUsers);
        this.router.patch("/:id", this.updateUser);
        this.router.delete("/:id", this.deleteUser);
    }

    private async getUser(req:Request, res:Response, next:NextFunction): Promise<void> {
       try {
        const id=req.params.id
        const result=await UsersService.getUser(id);
        res.status(result.status).json(result);
       } catch (error) {
        next(error)
       }
    }

    private async getAllUsers(req:Request, res:Response, next:NextFunction): Promise<void> {
        try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
         const result=await UsersService.getAllUsers({ skip, limit });
         res.status(result.status).json(result);
        } catch (error) {
         next(error)
        }
    }
    
    private async updateUser(req:Request, res:Response, next:NextFunction): Promise<void> {
        try {
            if ((req.user as any).id !== req.params.id) {
                throw new AppError("cannot update other user", 401);
            }
         const result=await UsersService.updateUser(req.params.id, req.body);

         res.status(result.status).json(result);
        } catch (error) {
         next(error)
        }
    }

    private async deleteUser(req:Request, res:Response, next:NextFunction): Promise<void> {
        try {
         const result=await UsersService.deleteUser(req.params.id);
         res.status(result.status).json(result);
        } catch (error) {
         next(error)
        }
    }

}

export default new UsersController().router;