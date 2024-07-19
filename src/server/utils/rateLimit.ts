interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

type RequestCounts = Map<string, number[]>;

export const rateLimit = (options: RateLimitOptions) => {
  const { windowMs, maxRequests } = options;
  const requestCounts: RequestCounts = new Map();

  return (req: any, res: any, next: any) => {
    const now: number = Date.now();
    const windowStart: number = now - windowMs;
    const ip: string = req.ip;

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const timestamps: number[] = requestCounts.get(ip) || [];

    const recentTimestamps = timestamps.filter(
      (timestamp: number) => timestamp > windowStart
    );

    if (recentTimestamps.length >= maxRequests) {
      const retryAfter: number = Math.ceil(
        (recentTimestamps[0] + windowMs - now) / 1000
      );
      res.setHeader("Retry-After", retryAfter);
      return res
        .status(403)
        .send(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
    }

    recentTimestamps.push(now);
    requestCounts.set(ip, recentTimestamps);

    next();
  };
};
