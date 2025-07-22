import { auth } from '@/auth'
import { ActivityAction, EntityType, Prisma, PrismaClient } from '../app/generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'
const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
}

type ExtensionContext = {
  ActivityLog: PrismaClient['activityLog'],
  __ipAddress?: string,
  __userAgent?: string,
  metadata?: string
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
                metadata?: string,
                ipAddress?: string,
                userAgent?: string
            ) {
                const context = Prisma.getExtensionContext(this) as unknown as ExtensionContext;
                if(!('ActivityLog' in context)) return;
                
                return context.ActivityLog.create({
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
                    Reports: ['update', 'delete'],
                    Subscribers: ['create', 'delete'],
                    Contributions: ['create', 'update'],
                    Users: []
                }

                const shouldLog = loggableOperations[model]?.includes(operation);
                if(!shouldLog) return result;

                const session = await auth()
                if(!session || !session.user){
                    console.warn("No session available for activity logging")
                    return result;
                }
                const userId = session.user.id;
                
                if(!userId) return result;

                let action: ActivityAction | null = null;
                let entityType = model;
                let entityId: string | null | undefined = null;

                switch (model) {
                    case "ComplaintUpVotes":
                        action = operation === "create" ? "CREATE_COMPLAINTUPVOTES" : "DELETE_COMPLAINTUPVOTES"
                        entityType = "Complaint";
                        entityId = operation === "create" ? args.data.complaintId : operation === "delete" ? args.where.complaintId?.toString() : null;
                        break;
                    case "Contributions":
                        if(operation === "create"){
                            action = "CREATE_CONTRIBUTIONS";
                        }else if(operation === "update"){
                            const isAdminAccept = args.data.contributionValidated !== undefined; //nese admini e ka akseptu kontribimin
                            action = isAdminAccept ? "UPDATE_CONTRIBUTIONS_ADMIN_ACCEPT" : "UPDATE_CONTRIBUTIONS_ADMIN_UPDATE"
                        }
                        entityType = "Contributions"
                        entityId = operation === "create" ? args.data.id : operation === "update" ? args.where.id : operation === "delete" ? args.where.id : null
                        break;
                    case "Companies":
                        action = operation === "create" ? "CREATE_COMPANIES" : operation === "update" ? "UPDATE_COMPANIES" : "DELETE_COMPANIES";
                        entityType = "Companies"
                        entityId = operation === "create" ? args.data.id : operation === "update" ? args.where.id : operation === "delete" ? args.where.id : null;
                        break;
                    case "Users": 
                        return result;
                    case "Reports":
                        action = operation === "update" ? "UPDATE_REPORTS" : "DELETE_REPORTS"
                        entityType = "Reports"
                        entityId = operation === "update" ? args.where.id : operation === "delete" ? args.where.id : null
                        break;
                    case "Complaint":
                        action = operation === "create" ? "CREATE_COMPLAINT" : operation === "update" ? "UPDATE_COMPLAINT" : "DELETE_COMPLAINT";
                        entityType = "Complaint"
                        entityId = operation === "create" ? args.data.id : operation === "update" ? args.where.id : operation === "delete" ? args.where.id : null
                        break;
                    case "Subscribers":
                        action = operation === "create" ? "CREATE_SUBSCRIBERS" : "DELETE_SUBSCRIBERS";
                        entityId = operation === "create" ? args.data.id : operation === "delete" ? args.where.id : null
                        break;
                    default:
                        return result;
                }

                try {
                    if(action && Object.values(ActivityAction).includes(action)) {
                        const context = Prisma.getExtensionContext(this) as unknown as ExtensionContext;
                        if("ActivityLog" in context){
                            await context.ActivityLog.create({
                                data: {
                                    userId,
                                    action,
                                    entityType,
                                    entityId,
                                    metadata: {
                                    model,
                                    operation,
                                    args: JSON.parse(JSON.stringify(args))
                                    },
                                    ipAddress: context.__ipAddress,
                                    userAgent: context.__userAgent
                                }
                            })
                        }
                    }
                } catch (error) {
                    console.log("Failed to create activity log", error)
                }
                
                return result;
            }
        }
    }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma