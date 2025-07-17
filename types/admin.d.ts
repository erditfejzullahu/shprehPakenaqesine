import { Companies, Complaint, Users, Reports, Subscribers, Contributions } from "@prisma/client"

export type Company = Companies & {
  complaintsCount: number
}

export type ExtendedComplaint = Complaint & {
  company: Companies
  user: Users
  reportsCount: number
  contributionsCount: number
}

export type ExtendedUser = Users & {
  complaintsCount: number
  contributionsCount: number
}

export type ExtendedReport = Reports & {
  complaint: Complaint
}

export type ExtendedSubscriber = Subscribers

export type ExtendedContribution = Contributions & {
  complaint: Complaint
  user: Users
}