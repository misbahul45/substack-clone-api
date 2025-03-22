import { Socket, Server as SocketIOServer } from "socket.io";
import { CreateNotificationBody } from "./notification.validation";
import { notificationService } from "./notification.service";

const handleNotification = (socket: Socket, io: SocketIOServer) => {
  // Event untuk membuat notifikasi baru
  socket.on("notification", async (data: CreateNotificationBody) => {
    try {
      const notification = await notificationService.createNotification(data);
      io.emit("notification", notification);
    } catch (error) {
      socket.emit("notification_error", { message: "Failed to create notification" });
    }
  });

  // Event untuk mengupdate notifikasi agar isRead menjadi true
  socket.on("mark_notification_read", async (notificationId: string) => {
    try {
      const updatedNotification = await notificationService.markAsRead(notificationId);
      io.emit("notification_updated", updatedNotification);
    } catch (error) {
      socket.emit("notification_error", { message: "Failed to update notification" });
    }
  });

  // Event untuk menghapus notifikasi
  socket.on("delete_notification", async (notificationId: string) => {
    try {
      const notification = await notificationService.deleteNotification(notificationId);
      io.emit("notification_deleted", notification);
    } catch (error) {
      socket.emit("notification_error", { message: "Failed to delete notification" });
    }
  });
};

export default handleNotification;
