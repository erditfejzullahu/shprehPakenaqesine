import Redis from "ioredis"

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!),
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
});

export async function rateLimit(key: string, limit: number, windowInSeconds: number): Promise<{allowed: boolean; remaining: number; reset: number, responseHeaders: HeadersInit }> {
   const current = await redis.incr(key);
   let remaining = limit - current;
   let reset = windowInSeconds;
   
   if(current === 1){
    await redis.expire(key, windowInSeconds)
   }else{
    const ttl = await redis.ttl(key);
    reset = ttl;
    remaining = Math.max(0, limit - current);
   }

   const responseHeaders = {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': reset.toString()
   }

    return {
        allowed: current <= limit,
        remaining,
        reset,
        responseHeaders
    }
}

export default redis;