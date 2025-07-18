import prisma from '@/lib/prisma'

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
  ])

  const calculateChange = (current: number, lastMonth: number) => {
    if (lastMonth === 0) return 0
    return Math.round(((current - lastMonth) / lastMonth) * 100)
  }

  return {
    companiesCount,
    complaintsCount,
    usersCount,
    subscribersCount,
    companiesChange: calculateChange(companiesCount, lastMonthCompanies),
    complaintsChange: calculateChange(complaintsCount, lastMonthComplaints),
    usersChange: calculateChange(usersCount, lastMonthUsers),
    subscribersChange: calculateChange(subscribersCount, lastMonthSubscribers),
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