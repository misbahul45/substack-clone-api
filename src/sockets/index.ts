import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import handleNotification from "./notification/notification.socket";

const setupSockets = (server: HttpServer) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*",
        }
    });

    io.on("connection", (socket) => {
        console.log("🔗 A user connected:", socket.id);

        // Integrasi fitur dengan socket io
        handleNotification(socket, io);

        socket.on("disconnect", () => {
            console.log("❌ A user disconnected:", socket.id);
        });
    });

    return io;
};

export default setupSockets;
