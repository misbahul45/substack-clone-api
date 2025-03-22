import { Role } from "@prisma/client"
import { z } from "zod"

export class UsersValidation {
    static readonly userUpdate = z.object({
        name: z.string().optional(),
        email: z.string().email({ message: 'Invalid email address' }).optional(),
        bio: z.string().optional(),
        role: z.nativeEnum(Role).optional(),
        avatar:z.object({
            url:z.string(),
            imageId:z.string()
        }).optional(),
    })
}

export type UpdateUserBody = z.infer<typeof UsersValidation.userUpdate>