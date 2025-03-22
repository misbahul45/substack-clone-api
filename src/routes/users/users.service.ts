import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { WebResponse } from "../../types/web.types";
import { AllUserResponse, UserResponse } from "../../types/user.types";
import { UpdateUserBody } from "./users.validation";

export class UsersService{
    static async getUser(id: string): Promise<WebResponse<UserResponse>> {
        try {
            const user = await prisma.user.findFirst({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isVerified: true,
                    bio: true,
                    createdAt: true
                }
            });
    
            if (!user) {
                throw new AppError("User not found", 404);
            }
    
            return { 
                success: true,
                status: 200,
                data: {
                    user
                },
                message: "User fetched successfully"
            };
        } catch (error) {
            const status = error instanceof AppError ? error.status : 500;
            throw new AppError((error as Error).message, status);
        }
    }
    

    static async getAllUsers({ skip, limit }:{ skip: number, limit: number }): Promise<WebResponse<{ users:AllUserResponse }>> {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isVerified: true,
                    bio: true,
                    createdAt: true
                },
                where:{
                    isVerified: true
                },
                skip: skip,
                take: limit
            })

            const totalUser=await prisma.user.count()

            return {
                success: true,
                status: 200,
                data: {
                    users: users
                },
                meta: {
                    pages: Math.ceil(totalUser / limit),
                    page: skip / limit + 1,
                    total: totalUser,
                    skip
                },
            }

        } catch (error) {
            throw new AppError(error as string, 500);
        }
    }

    static async deleteUser(id: string): Promise<WebResponse> {
        try {
            const findUser=await prisma.user.count({where:{id}});
            if (findUser==0) {
                throw new AppError("User not found", 404);
            }

            await prisma.user.delete({
                    where:{id}
            });

            return {
                success: true,
                status: 200,
                message: "User deleted successfully"
            }
        } catch (error) {
            const status = error instanceof AppError ? error.status : 500;
            throw new AppError((error as Error).message, status);
        }
    }

    static async updateUser(id: string, data: UpdateUserBody): Promise<WebResponse> {
        try {
            const findUser=await prisma.user.count({where:{id}});
            if (findUser==0) {
                throw new AppError("User not found", 404);
            }

            await prisma.user.update({
                where: { id },
                data: {
                    ...(data.name && { name: data.name }),
                    ...(data.bio && { bio: data.bio }),
                    ...(data.role && { role: data.role }),
                    ...(data.email && { email: data.email }),
                    avatar: data.avatar
                        ? {
                              upsert: {
                                  create: {
                                      url: data.avatar.url,
                                      imageId: data.avatar.imageId,
                                  },
                                  update: {
                                      url: data.avatar.url,
                                      imageId: data.avatar.imageId,
                                  },
                              },
                          }
                        : undefined,
                },
            });
        
            return {
                success: true,
                status: 200,
                message: "User updated successfully"
            }
        }catch (error) {
            const status = error instanceof AppError ? error.status : 500;
            throw new AppError((error as Error).message, status);
        }
    }
}