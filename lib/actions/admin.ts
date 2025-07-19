import prisma from '@/lib/prisma'
import { ExtendedReport, ReportsGroupBy } from '@/types/admin'

export async function getDashboardStats() {
  const [
    companiesCount,
    complaintsCount,
    usersCount,
    subscribersCount,
    lastMonthCompanies,
    lastMonthComplaints,
    lastMonthUsers,
    lastMonthSubscribers,
    recentComplaints,
  ] = await Promise.all([
    prisma.companies.count(),
    prisma.complaint.count(),
    prisma.users.count(),
    prisma.subscribers.count(),
    prisma.companies.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      }
    }),
    prisma.complaint.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      }
    }),
    prisma.users.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      }
    }),
    prisma.subscribers.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      }
    }),
    prisma.complaint.findMany({
      where: {status: "PENDING"},
      orderBy: {
        createdAt: "desc"
      },
      include: {
        company: true,
        user: true,
      },
      take: 20
    }),
  ])

  const complaintsWithMostReports = await prisma.complaint.findMany({
    take: 20,
    orderBy: {
      reports: {
        _count: 'desc'
      }
    },
    include: {
      _count: {
        select: {
          reports: true,
          contributions: true
        }
      },
      user: {
        select: {
          fullName: true,
          userProfileImage: true
        }
      },
      company: {
        select: {
          id: true,
          name: true
        }
      },
      reports: {
        take: 1,
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  const calculateChange = (current: number, lastMonth: number) => {
    if (lastMonth === 0) return 0
    return Math.round(((current - lastMonth) / lastMonth) * 100)
  }

  const reportOverview = complaintsWithMostReports.map(complaint => ({
    complaintId: complaint.id,
    complaintTitle: complaint.title,
    complaintResolvedStatus: complaint.resolvedStatus,
    complaintStatus: complaint.status,
    totalReports: complaint._count.reports,
    complaintContributions: complaint._count.contributions,
    complaintUser: {
      name: complaint.user.fullName,
      image: complaint.user.userProfileImage
    },
    complaintCompany: complaint.company ? {
      companyName: complaint.company.name,
      companyId: complaint.company.id
    } : null,
    complaintUpVotes: complaint.upVotes,
    complaintAttachments: complaint.attachments.length,
    complaintVideoAttachments: complaint.videosAttached.length,
    complaintAudioAttachments: complaint.audiosAttached.length,
    complaintCategory: complaint.category,
    complaintMunicipality: complaint.municipality,
    mostRecentReport: complaint.reports[0] ? {
      title: complaint.reports[0].title,
      description: complaint.reports[0].description,
      attachments: complaint.reports[0].attachments,
      videoAttachments: complaint.reports[0].videoAttachments,
      audioAttachments: complaint.reports[0].audioAttachments,
      createdAt: complaint.reports[0].createdAt
    } : null
  }))

  return {
    companiesCount,
    complaintsCount,
    usersCount,
    subscribersCount,
    companiesChange: calculateChange(companiesCount, lastMonthCompanies),
    complaintsChange: calculateChange(complaintsCount, lastMonthComplaints),
    usersChange: calculateChange(usersCount, lastMonthUsers),
    subscribersChange: calculateChange(subscribersCount, lastMonthSubscribers),
    recentComplaints,
    reportOverview // No need for getReportsWithData as we've already formatted it
  }
}


export async function getCompanies() {
  return await prisma.companies.findMany({
    include: {
      _count: {
        select: { complaints: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}


// Add to your existing admin actions

export async function getComplaints() {
    return await prisma.complaint.findMany({
      include: {
        company: true,
        user: true,
        _count: {
          select: { reports: true, contributions: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
  
  export async function getUsers() {
    return await prisma.users.findMany({
      include: {
        _count: {
          select: { complaints: true, contributions: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
  
  export async function getReports() {
    return await prisma.reports.findMany({
      include: {
        complaint: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
  
  export async function getSubscribers() {
    return await prisma.subscribers.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  export async function getContributions() {
    return await prisma.contributions.findMany({
      include: {
        complaint: true,
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  
  