import { Reports } from "@/app/generated/prisma"
import { Companies, Complaint, Users, Subscribers, Contributions } from "@/app/generated/prisma"

export type Company = Companies & {
  _count: {
    complaints: number
  }
}

export type ExtendedComplaint = Complaint & {
  company?: Companies | null
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
  complaint: Complaint & {
    company?: {
      id: string;
      name: string;
    } | null
  }
}

export type ExtendedSubscriber = Subscribers

export type ExtendedContributionComplaint = Complaint & {
  company: Companies | null
}

export type ExtendedContribution = Contributions & {
  complaint: ExtendedContributionComplaint
  user: Users
}

export type ReportsGroupBy = {
  complaintId: string | null,
  _count: {complaintId: number}
}
