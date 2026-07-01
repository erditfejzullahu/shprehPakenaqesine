import { Redis } from "@upstash/redis";

function getRedisConfig() {
    const url =
        process.env.KV_REST_API_URL ??
        process.env.UPSTASH_REDIS_REST_URL;

    const token =
        process.env.KV_REST_API_TOKEN ??
        process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error(
            "Missing Redis config. Set KV_REST_API_URL + KV_REST_API_TOKEN (Vercel KV) or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN."
        );
    }

    return { url, token };
}

const redis = new Redis(getRedisConfig());

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
