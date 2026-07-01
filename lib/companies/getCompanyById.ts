import prisma from "@/lib/prisma";
import { CompanyPerIdInterface } from "@/types/types";

export async function getCompanyById(id: string): Promise<CompanyPerIdInterface | null> {
  const company = await prisma.companies.findUnique({
    where: { id },
    include: {
      complaints: {
        where: {
          AND: [{ status: "ACCEPTED" }, { deleted: false }],
        },
      },
    },
  });

  if (!company) return null;

  const complaintsCount = company.complaints.length;
  const now = new Date();
  const createdAt = company.createdAt;
  const diffInMonths =
    (now.getFullYear() - createdAt.getFullYear()) * 12 +
    (now.getMonth() - createdAt.getMonth()) +
    1;

  return {
    success: true,
    company,
    complaintsPerMonth: complaintsCount / diffInMonths,
  };
}
