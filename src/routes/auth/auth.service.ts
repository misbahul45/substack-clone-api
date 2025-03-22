import prisma from "../../lib/prisma";
import { Validation } from "../../lib/zod";
import { AppError } from "../../middleware/error.middleware";
import { WebResponse } from "../../types/web.types";
import AuthValidations, {  RegisterBody, UpdatePasswordBody, VerifyOtpBody } from "./auth.validations";
import jwt from 'jsonwebtoken';
import ENVDATA from "../../lib/env-file";
import { createEmail, transporterEmail } from "../../lib/email";
import { datediff, hashedPassword } from "../../lib/util";

export class AuthService {
    static async signup(data: RegisterBody): Promise<WebResponse> {
        try {
            const validate = Validation.validate(data, AuthValidations.register);
            if (!validate.success) {
                throw new AppError(
                    "Validation failed",
                    400,
                    validate.error?.errors.map((err) => ({
                        path: err.path.join("."),
                        message: err.message,
                    }))
                );
            }            

            data.password = await hashedPassword(data.password);

            const userExists = await prisma.user.findUnique({
                where: {
                    email:data.email
                }
            })
            if (userExists) {
                throw new AppError("User already exists", 400);
            }

            await prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password
                }
            })

            const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

            //save otp to database user
            await prisma.otp.create({
                data:{
                    email:data.email,
                    otp
                }
            })

            const mailOpttion = createEmail(data.email, 'Verify OTP', otp);
            await transporterEmail.sendMail(mailOpttion).catch((e) => {
                throw new AppError("Failed to send email", 500);
            });

            return {
                success: true,
                status: 201,
                message: "Registration successful, otp sent to your email",
            };
        } catch (error: any) {
            if (error.code === "P2002") {
                throw new AppError(
                    "User already exists",
                    400,
                    [{ path: "email", message: "Email has already been taken" }]
                );
            }

            const status = error instanceof AppError ? error.status : 500;
            throw new AppError((error as Error).message, status);
        }
    }

    static async signin(id:string): Promise<boolean>{
        try {
            const user=await prisma.user.findUnique({
                where:{
                    id
                },
                select:{
                    isVerified:true
                }
            });

            if (!user) {
                throw new AppError("User not found", 404);
            }
            return user.isVerified;
        } catch (error) {
            const status = error instanceof AppError ? error.status : 500;
            throw new AppError((error as Error).message, status);
        }
    }

    static generateTokens(user: any) {
        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            ENVDATA.AUTH_SECRET!,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            ENVDATA.REFRESH_SECRET!,
            { expiresIn: "7d" } 
        );

        return { accessToken, refreshToken };
    }
    
    static async resetPassword(email: string): Promise<WebResponse<{ otp: number }>> {
        try {
            const validate = Validation.validate({ email }, AuthValidations.forgotPassword);
            if (!validate.success) {
                throw new AppError(
                    "Validation failed",
                    400,
                    validate.error?.errors.map((err) => ({
                        path: err.path.join("."),
                        message: err.message,
                    }))
                )
            }
            const findUser = await prisma.user.count({
                where: {
                    email: email
                },
            })
            if (findUser==0) {
                throw new AppError("User not found", 404);
            }
    
            const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

            //save otp to database user
            await prisma.otp.upsert({
                where: {
                    email: email
                },
                update: {
                    otp: otp
                },
                create: {
                    email: email,
                    otp: otp
                }
            })

            const mailOpttion = createEmail(email, "Password reset", `<h1>OTP for password reset is ${otp}</h1>`);
    
            await transporterEmail.sendMail(mailOpttion).catch((e) => {
                console.log(e);
                throw new AppError("Failed to send email", 500);
            });
    
            return {
                success: true,
                data: { otp },
                status: 200,
                message: "OTP sent to your email, please check your email.",
            };
        } catch (error: any) {
            const status = error instanceof AppError ? error.status : 500;
            throw new AppError((error as Error).message, status);
        }
    }

    static async verifyOtp(data: VerifyOtpBody): Promise<WebResponse<undefined>> {
        try {
           const validate = Validation.validate(data, AuthValidations.VerifyOtp);
            if (!validate.success) {
                throw new AppError(
                    "Validation failed",
                    400,
                    validate.error?.errors.map((err) => ({
                        path: err.path.join("."),
                        message: err.message,
                    }))
                )
            }

            const findOtp=await prisma.otp.findUnique({
                where: {
                    email: data.email
                }
            });

            if (!findOtp) {
                throw new AppError("OTP not found", 404);
            }
            if (findOtp.otp !== data.otp) {
                throw new AppError("Invalid OTP, please try again", 400);
            }

            if(datediff(findOtp.createdAt, new Date()) >= 1) {
                await prisma.otp.delete({
                    where: {
                        email: data.email
                    }
                })
                throw new AppError("OTP expired", 400);
            }

            await prisma.otp.delete({
                where: {
                    email: data.email
                }
            })

            await prisma.user.update({
                where: {
                    email: data.email
                },
                data: {
                    isVerified: true
                }
            })

            return {
                success: true,
                status: 200,
                message: "OTP verified successfully"
            };
        } catch (error: any) {
            const status = error instanceof AppError ? error.status : 500;
            throw new AppError((error as Error).message, status);
        }
    }
    static async updatePassword(data: UpdatePasswordBody): Promise<WebResponse<undefined>> {
        try {
            const validate = Validation.validate(data, AuthValidations.updatePassword);
            if (!validate.success) {
                throw new AppError(
                    "Validation failed",
                    400,
                    validate.error?.errors.map((err) => ({
                        path: err.path.join("."),
                        message: err.message,
                    }))
                )
            }

            const findOtp=await prisma.otp.findUnique({
                where: {
                    email: data.email
                }
            });

            if(findOtp) {
                throw new AppError("Please verify your otp first", 400);
            }

             data.password=await hashedPassword(data.password);

            await prisma.user.update({
                where: {
                    email: data.email
                },
                data:{
                    password: data.password
                }
            })
            return {
                success: true,
                status: 200,
                message: "Password updated successfully"
            }
        } catch (error: any) {
            const status = error instanceof AppError ? error.status : 500;
            throw new AppError((error as Error).message, status);
        }
    }
}