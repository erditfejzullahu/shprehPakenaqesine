import { Reports } from "@/app/generated/prisma"
import { Companies, Complaint, Users, Subscribers, Contributions } from "@/app/generated/prisma"

export type Company = Companies & {
  _count: {
    complaints: number
  }
}

export type ExtendedComplaint = Complaint & {
  company: Companies
  user: Users
  reportsCount: number
  contributionsCount: number
}

export type ExtendedUser = Users & {
  _count: {
    complaints: number,
    contributions: number  
  }
}

export type ExtendedReport = Reports & {
  complaint: ExtendedComplaint
}

export type ExtendedSubscriber = Subscribers

export type ExtendedContribution = Contributions & {
  complaint: Complaint
  user: Users
}

export type ReportsGroupBy = {
  complaintId: string | null,
  _count: {complaintId: number}
}
