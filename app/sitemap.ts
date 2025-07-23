import prisma from "@/lib/prisma";
import { MetadataRoute } from "next";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
    {
        url: 'https://shfaqpakenaqesine.com',
        lastModified: new Date(),
        priority: 1,
    },
    {
        url: 'https://shfaqpakenaqesine.com/si-funksjonon',
        lastModified: new Date(),
        priority: 0.7,
    },
    {
        url: 'https://shfaqpakenaqesine.com/cmimore',
        lastModified: new Date(),
        priority: 0.7,
    },
    {
        url: 'https://shfaqpakenaqesine.com/verifikimi',
        lastModified: new Date(),
        priority: 0.7,
    },
    {
        url: 'https://shfaqpakenaqesine.com/na-kontaktoni',
        lastModified: new Date(),
        priority: 0.7,
    },
    {
        url: 'https://shfaqpakenaqesine.com/politika-e-privatesise',
        lastModified: new Date(),
        priority: 0.7,
    },
    {
        url: 'https://shfaqpakenaqesine.com/termat-e-perdorimit',
        lastModified: new Date(),
        priority: 0.7,
    },
    {
        url: 'https://shfaqpakenaqesine.com/shto-kompani',
        lastModified: new Date(),
        priority: 0.7,
    },
    {
        url: 'https://shfaqpakenaqesine.com/krijo-raportim',
        lastModified: new Date(),
        priority: 0.7,
    },
    {
        url: 'https://shfaqpakenaqesine.com/kompanite',
        lastModified: new Date(),
        priority: 1,
    },
    {
        url: 'https://shfaqpakenaqesine.com/ankesat',
        lastModified: new Date(),
        priority: 1,
    },
]

async function getDynamicContent() {
    try {
        const [companies, complaints] = await Promise.all([
            prisma.companies.findMany({
                select: {
                    id: true,
                    updatedAt: true
                }
            }),
            prisma.complaint.findMany({
                where: {status: "ACCEPTED"},
                select: {
                    id: true,
                    updatedAt: true
                }
            })
        ])

        return {
            companies: companies.map(company => ({
                url: `https://shfaqpakenaqesine/kompanite/${company.id}`,
                lastModified: company.updatedAt,
                priority: 1
            })),
            complaints: complaints.map(complaint => ({
                url: `https://shfaqpakenaqesine/ankesat/${complaint.id}`,
                lastModified: complaint.updatedAt,
                priority: 1
            }))
        }
    } catch (error) {
        console.error('error getting sitemaps: ', error);
        return {companies: [], complaints: []}
    } finally {
        await prisma.$disconnect()
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const {companies, complaints} = await getDynamicContent();

    return [
        ...STATIC_ROUTES,
        ...companies,
        ...complaints
    ]
}

export const revalidate = 3600