import { Companies, Complaint, Users } from "@/app/generated/prisma";

export interface ComplaintCardProps extends Omit<Complaint, "attachments"> {
    attachments?: string[]
    company: Companies,
    user: Users
}
export interface CompanyInterface extends Omit<Companies, "images"> {
    images?: string[]
    complaintsCount: number;
}

export interface CompaniesWithHasMore{
    companies: CompanyInterface[],
    hasMore: boolean,
    filteredOrNotFilteredCount?: number
}

export interface ComplaintsWithHasMore{
    complaints: ComplaintCardProps[],
    hasMore: boolean,
    filteredOrNotFilteredCount?: number
}