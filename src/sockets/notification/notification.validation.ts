import { z } from "zod";

export class NotificationValidation {
  static readonly create = z.object({
    message: z.string().min(1, { message: "Message tidak boleh kosong" }),
    type: z.enum(["COMMENT", "LIKE", "NEW_POST", "SYSTEM", "FOLLOW"]),
    userId: z.string().min(1, { message: "UserId tidak boleh kosong" }),
    relatedEntityId: z.string().optional(),
    relatedEntity: z.string().optional(),
  });

}


export type CreateNotificationBody = z.infer<typeof NotificationValidation.create>;