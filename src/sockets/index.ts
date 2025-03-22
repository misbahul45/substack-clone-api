import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import handleNotification from "./notification/notification.socket";

export class SocketApp {
  private static io: SocketIOServer | null = null;

  public static setupSockets(server: HttpServer): SocketIOServer {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Tangani notifikasi
      handleNotification(socket, this.io!);

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });

    return this.io;
  }

  public static getSocketIO(): SocketIOServer | null {
    return this.io;
  }
}
