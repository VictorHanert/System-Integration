import { WebSocketServer } from "ws";

const PORT = process.env.PORT ?? 8080;

const server = new WebSocketServer({ port: PORT });

server.on("connection", (socket) => {
  console.log("Client connected", server.clients.size);

  socket.on("message", (message) => {
    console.log(`Received: ${message}`);
    socket.send(`Echo: ${message}`);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log(`Server started on ws://localhost:${PORT}`);
