import prisma from "../prisma"

export const getCompaniesList = async () => {
    return await prisma.companies.findMany({
        take: 10
    })
}

export const getComplaintList = async () => {
    const complaints = await prisma.complaint.findMany({
        take: 20,
        include: {
            user: {
                select: {
                    fullName: true,
                    anonimity: true
                }
            },
            company: {
                select: {
                    name: true
                }
            }
        }
    })

    return complaints.map((item) => ({
        ...item,
        user: item.user.anonimity ? null : {
            fullName: item.user.fullName
        }
    }))
}