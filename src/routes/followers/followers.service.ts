import { User } from "@prisma/client";
import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { WebResponse } from "../../types/web.types";

export class FollowersService {
    static async addFollower(userId: string, followerId: string): Promise<WebResponse> {
        try {
            await prisma.follower.create({
                data: {
                    userId,
                    followerId
                }
            });
            return{
                success: true,
                status: 200,
            }
        } catch{
            throw new AppError('internal server error', 500);
        }
    }

    static async deleteFollower(userId: string, followerId: string): Promise<WebResponse> {
        try {
            await prisma.follower.deleteMany({
                where: {
                    userId,
                    followerId
                }
            });
            return{
                success: true,
                status: 200,
            }
        } catch{
            throw new AppError('internal server error', 500);
        }
    }

    static async getAllFollowers(userId: string): Promise<WebResponse<Partial<User>[]>> {
        try {
            const followerRecords=await prisma.follower.findMany({
                where:{
                    userId
                },
                select: {
                    follower: {
                      select: {
                        id: true,
                        email: true,
                        name: true,
                        bio: true,
                        avatar: true,
                      },
                    },
                  },
            })

            const followers: Partial<User>[] = followerRecords.map(record => record.follower);

            return { success: true, status:200, data: followers };
        } catch {
            throw new AppError('internal server error', 500);
        }
    }

    static async isUserFollow(userId: string, followerId: string):Promise<WebResponse>{
        try {
            const isFollow=await prisma.follower.count({
                where:{
                    userId,
                    followerId
                }
            })
            if(isFollow<=0){
                throw new AppError('not found', 404)
            }
            return {
                success:true,
                status:200
            }
        } catch(error) {
            const status = error instanceof AppError ? error.status : 500;
            throw new AppError((error as Error).message, status);
        }
    }
}