import type { Server } from "socket.io";
import { kindeClient } from "../routes/authRouter";
import { sessionManager } from "../routes/authRouter";

async function computeUserIdFromHeaders(cookie: string) {
  const cookies = cookie.split("; ").reduce(
    (cookieObject: Record<string, any>, cookieString: string) => {
      const cookies = cookieString.split("=");
      cookieObject[cookies[0]] = cookies[1];
      return cookieObject;
    },
    {} as Record<string, any>
  );
  const user = await kindeClient.getUserProfile(sessionManager({ cookies }));
  return user.id;
}

export function setupSocketConnectionListener(io: Server) {
  io.on("connection", async (socket) => {
    if (!socket.handshake.headers.cookie) return;

    try {
      const userId = await computeUserIdFromHeaders(
        socket.handshake.headers.cookie
      );

      socket.join(userId);
    } catch (e) {
      // console.log('Error while connecting a socket, user is not authenticated');
      // console.error(e);
    }
  });
}
