import { parse } from "cookie";
import type { Server } from "socket.io";
import { kindeClient, sessionManager } from "../routes/authRouter";

async function computeUserIdFromHeaders(cookieHeader: string): Promise<string | null> {
  try {
    // ✅ Use cookie.parse instead of manual string splitting
    // Manual splitting breaks on URL-encoded values and cookies containing "="
    const cookies = parse(cookieHeader);
    const user = await kindeClient.getUserProfile(sessionManager({ cookies }));
    return user.id;
  } catch (e) {
    console.error("Failed to compute user id from socket handshake cookie:", e);
    return null;
  }
}

export function setupSocketConnectionListener(io: Server) {
  io.on("connection", async (socket) => {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      socket.disconnect();
      return;
    }

    const userId = await computeUserIdFromHeaders(cookieHeader);
    if (!userId) {
      socket.disconnect();
      return;
    }

    socket.join(userId);
    console.log(`Socket connected: user ${userId} [${socket.id}]`);

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: user ${userId} reason: ${reason}`);
    });
  });
}
