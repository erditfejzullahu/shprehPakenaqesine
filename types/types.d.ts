import { Companies, Complaint } from "@/app/generated/prisma";

export interface ComplaintCardProps extends Omit<Complaint, "attachments"> {
    attachments?: string[]
    company: Companies
}
export interface CompanyInterface extends Omit<Companies, "images"> {
    images?: string[]
    complaintsCount: number;
}

export interface CompaniesWithHasMore{
    companies: CompanyInterface[],
    hasMore: boolean
}