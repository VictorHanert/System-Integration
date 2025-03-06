import { WebSocket } from "ws";

const websocketClient = new WebSocket("ws://localhost:8080");

websocketClient.on("open", () => {
  websocketClient.send("Hello from client");

  websocketClient.on("message", (message) => {
    console.log(`Received: ${message}`);
  });

    websocketClient.on("close", () => {
        console.log("Connection closed");
    });
});