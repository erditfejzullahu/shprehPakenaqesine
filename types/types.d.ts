import { Companies, Complaint, Contributions, ResolvedStatus, Users } from "@/app/generated/prisma";

export interface ComplaintCardProps extends Complaint {
    company?: Companies,
    user: Users
}
export interface CompanyInterface extends Companies {
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
    success: boolean;
    details: {
        complaints: MyProfileComplaints[] | null,
        contributions: MyProfileContributions[] | null
    } | null
}

export interface CompanyPerIdWithComplaint extends Companies{
    complaints: Complaint[]
}

export interface CompanyPerIdInterface {
    success: boolean;
    company: CompanyPerIdWithComplaint;
    complaintsPerMonth: number;
}

export interface ComplaintPageContributions {
    user: {
        userProfileImage: string;
        username: string;
        fullName: string;
        reputation: string;
    } | null,
    evidencesGiven: {
        attachments: number
        audioAttachments: number
        videoAttachments: number
    },
}

export interface ComplaintPerIdWithCompany extends Complaint {
    company: Companies;
    user: {
        userProfileImage: string;
        username: string;
        fullName: string;
        reputation: string;
        complaints: string;
    } | null;
    evidencesGiven: {
        attachments: number
        audioAttachments: number
        videoAttachments: number
    },
    contributions: ComplaintPageContributions[];
    hasVoted: boolean;
}


export interface ComplantPerIdInterface {
    success: boolean;
    complaint: ComplaintPerIdWithCompany;
}

declare module '@/services/fileUploadService' {
    import { UploadResult } from '@/services/fileUploadService';
    
    export type EntityType = 
    'complaints/attachments' 
    | 'complaints/audiosAttached' 
    | 'complaints/videosAttached' 
    | 'companys/images'
    | 'companys/logo' 
    | 'users' 
    | 'reports/attachments'
    | 'reports/audiosAttached' 
    | 'reports/videosAttached';
    
    interface IFileUploadService {
      uploadFile(
        base64Data: string,
        entityType: EntityType,
        entityId: string
      ): Promise<UploadResult>;
      
      deleteFile(filePath: string): Promise<boolean>;
    }
  
    const fileUploadService: IFileUploadService;
    export default fileUploadService;
}

export interface UploadRequest {
    file: string;
    fileName: string;
    fileType: string;
}

export interface UploadResult {
    success: boolean;
    url: string;
    fileName: string;
    filePath: string;
    mimeType: string;
  }