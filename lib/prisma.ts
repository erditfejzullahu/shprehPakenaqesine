import { ActivityAction, EntityType, Prisma, PrismaClient } from '../app/generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'
const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
}

export const prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate()).$extends({
    name: "ActivityLogging",
    model: {
        $allModels: {
            async logActivity<T>(
                this: T,
                userId: string,
                action: ActivityAction,
                entityType: EntityType,
                entityId: string,
                metadata?: any,
                ipAddress?: any,
                userAgent?: any
            ) {
                const context = Prisma.getExtensionContext(this);
                if(!('ActivityLog' in context)) return;

                return(context as any).ActivityLog.create({
                    data: {
                        userId,
                        action,
                        entityType,
                        entityId,
                        metadata,
                        ipAddress,
                        userAgent
                    }
                })
            }
        }
    },
    query: {
        $allModels: {
            async $allOperations({model, operation, args, query}) {
                const result = await query(args)

                if(model === "ActivityLog") return result;

                const loggableOperations: Record<string, string[]> = {
                    Companies: ['create', "update", 'delete'],
                    Complaint: ['create', 'update', 'delete'],
                    ComplaintUpVotes: ['create', 'delete'],
                    Reports: ['create', 'update', 'delete'],
                    Subscribers: ['create', 'delete'],
                    Contributions: ['create'],
                    Users: []
                }

                const shouldLog = loggableOperations[model]?.includes(operation);
                if(!shouldLog) return result;

                const userId = args?.data?.userId || args?.where?.userId || result?.userId
                if(!userId) return result;
            }
        }
    }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma