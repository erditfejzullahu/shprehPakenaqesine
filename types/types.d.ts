import { Companies, Complaint, ResolvedStatus, Users } from "@/app/generated/prisma";

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

export interface MyProfileComplaints{
    companyId: string;
    companyName: string;
    title: string;
    createdAt: Date;
    upVotes: number;
    resolvedStatus: ResolvedStatus;
    id: string;
}

export interface MyProfileContributions{
    complaintTitle: string;
    complaintUpVotes: number;
    createdAt: Date;
    complaintId: string;
}

export interface MyProfileComplaintsContributions{
    success: boolean,
    details: {
        complaints: MyProfileComplaints[] | null,
        contributions: MyProfileContributions[] | null
    } | null
}