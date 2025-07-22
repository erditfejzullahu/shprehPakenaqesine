import { ActivityAction, EntityType, Prisma, PrismaClient } from '../app/generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'
import { getPrismaContext } from './prisma-context'
const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
}

type ExtensionContext = {
  ActivityLog: PrismaClient['activityLog'],
  __ipAddress?: string,
  __userAgent?: string,
  __user?: string | null,
  metadata?: string
}


export const prisma = new PrismaClient().$extends(withAccelerate()).$extends({
    name: "ActivityLogging",
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

                if(!action) return result;

                const {userId, ipAddress, userAgent} = getPrismaContext();

                try {
                    await prisma.activityLog.create({
                        data: {
                            userId,
                            action,
                            entityType,
                            entityId: entityId?.toString(),
                            metadata: JSON.stringify({model, operation, args}),
                            ipAddress,
                            userAgent
                        }
                    })
                } catch (error) {
                    console.log("Failed to create activity log", error)
                }
                
                return result;
            }
        }
    }
})

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma