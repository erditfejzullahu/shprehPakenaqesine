import { AsyncLocalStorage } from "node:async_hooks";

export type PrismaRequestContext = {
    userId?: string | null,
    ipAddress?: string | null,
    userAgent?: string | null
}

const prismaContext = new AsyncLocalStorage<PrismaRequestContext>()

export function runWithPrismaContext<T>(ctx: PrismaRequestContext, fn: () => T){
    console.log(ctx);
    
    return prismaContext.run(ctx, fn)
}

export function getPrismaContext(): PrismaRequestContext {
    return prismaContext.getStore() || {}
}