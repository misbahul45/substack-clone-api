import { Notification } from "@prisma/client";
import prisma from "../../lib/prisma";
import { Validation } from "../../lib/zod";
import { AppError } from "../../middleware/error.middleware";
import { CreateNotificationBody, NotificationValidation } from "./notification.validation";

export class notificationService{
    static async getAllNotifications(userId: string): Promise<Notification[]> {
        try {
          const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
          });
          return notifications;
        } catch (error) {
          throw new AppError("Failed to fetch notifications", 500);
        }
      }      
    static async createNotification(data: CreateNotificationBody): Promise<Notification> {
        try {
            const isValid=Validation.validate(data, NotificationValidation.create);
            if(!isValid.success) throw new AppError("Validation failed", 400);

            const notification=await prisma.notification.create({
                data:{
                    message: data.message,
                    type: data.type,
                    userId: data.userId,
                    relatedEntityId: data.relatedEntityId,
                    relatedEntity: data.relatedEntity
                }
            });
            return notification;
        } catch (error) {
            const status = error instanceof AppError ? error.status : 500;
            throw new AppError((error as Error).message, status);
        }
    }
    static async markAsRead(notificationId: string) {
        const updatedNotification = await prisma.notification.update({
          where: { id: notificationId },
          data: { isRead: true },
        });
        return updatedNotification;
    }

    static async deleteNotification(notificationId: string) {
        const notification = await prisma.notification.delete({
          where: { id: notificationId },
        });
        return notification;
      }
}