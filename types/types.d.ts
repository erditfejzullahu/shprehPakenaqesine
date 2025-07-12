import { Companies, Complaint } from "@/app/generated/prisma";

export interface ComplaintCardProps extends Complaint {
    company: Companies
}
export interface CompanyInterface extends Omit<Companies, "images"> {
    images?: string[]
}