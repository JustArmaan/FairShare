import { parse } from "cookie";
import type { Request, Response } from "express";
import { kindeClient, sessionManager } from "../routes/authRouter";

const clients = new Map<string, Set<Response>>();

async function getUserIdFromCookie(cookieHeader: string): Promise<string | null> {
  try {
    const cookies = parse(cookieHeader);
    const user = await kindeClient.getUserProfile(sessionManager({ cookies }));
    return user.id;
  } catch {
    return null;
  }
}

export async function sseHandler(req: Request, res: Response) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return res.status(401).end();
  }

  const userId = await getUserIdFromCookie(cookieHeader);
  if (!userId) {
    return res.status(401).end();
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }
  clients.get(userId)!.add(res);
  console.log(`SSE connected: user ${userId} (${clients.get(userId)!.size} connections)`);

  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 30000);

  req.on("close", () => {
    clearInterval(heartbeat);
    clients.get(userId)?.delete(res);
    if (clients.get(userId)?.size === 0) {
      clients.delete(userId);
    }
    console.log(`SSE disconnected: user ${userId}`);
  });
}

export function sendToUser(userId: string, event: string, data: unknown) {
  const userClients = clients.get(userId);
  if (!userClients || userClients.size === 0) return;

  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of userClients) {
    try {
      res.write(payload);
    } catch {
      userClients.delete(res);
    }
  }
}
