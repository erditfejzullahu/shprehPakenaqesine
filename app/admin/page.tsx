import { AlertCircleIcon, BuildingIcon, MailIcon, UsersIcon } from 'lucide-react'
import { StatsCard } from '@/components/admin/StatsCard'
import { getDashboardStats } from '@/lib/actions/admin'
import ReportedComplaintsCard from '@/components/admin/ReportedComplaintsCard'
import Link from 'next/link'
import { FaArrowsUpDown } from 'react-icons/fa6'
import LatestComplaintCard from '@/components/admin/LatestPendingComplaintCard'
import ContributionRequestCard from '@/components/admin/ContributionRequestCard'
import { isAdmin } from '@/lib/utils/isAdmin'
import AdminUserLogs from '@/components/admin/AdminUserLogs'

export default async function AdminDashboard() {
  await isAdmin('/')
  const stats = await getDashboardStats()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Companies" 
          value={stats.companiesCount} 
          icon={<BuildingIcon />}
          change={stats.companiesChange}
        />
        <StatsCard 
          title="Total Complaints" 
          value={stats.complaintsCount} 
          icon={<AlertCircleIcon />}
          change={stats.complaintsChange}
        />
        <StatsCard 
          title="Total Users" 
          value={stats.usersCount} 
          icon={<UsersIcon />}
          change={stats.usersChange}
        />
        <StatsCard 
          title="Subscribers" 
          value={stats.subscribersCount} 
          icon={<MailIcon />}
          change={stats.subscribersChange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow max-h-[400px] overflow-y-auto">
          <div className='mb-4 flex flex-row justify-between items-center'>          
            <h2 className="text-lg font-semibold">Ankesat e fundit të pamiratuara</h2>
            <Link 
              href="/admin/complaints" 
              aria-description="all companies"
              className="group flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
              >
              <span className="text-indigo-700 font-medium">Shiko të gjitha</span>
              <FaArrowsUpDown className="h-3.5 w-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
            <div className='flex flex-col gap-4'>
              {stats.recentComplaints.map((compliant) => (
                <LatestComplaintCard key={compliant.id} {...compliant}/>
              ))}
            </div>
            <Link 
              href="/admin/complaints"
              aria-description="all companies"
              className="group mt-4 w-fit ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
            >
              <span className="text-indigo-700 font-medium">Shiko të gjitha</span>
              <FaArrowsUpDown className="h-3.5 w-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          {/* Recent complaints table or chart */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow max-h-[400px] overflow-y-auto">
          <div className='mb-4 flex flex-row justify-between items-center'>
            <h2 className="text-lg font-semibold">Ankesat me shume raporte</h2>
            <Link 
              href="/admin/reports" 
              aria-description="all companies"
              className="group flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
            >
              <span className="text-indigo-700 font-medium">Shiko të gjitha</span>
              <FaArrowsUpDown className="h-3.5 w-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className='flex flex-col gap-4'>
            
            {stats.reportOverview.map((complaint) => (
              <ReportedComplaintsCard {...complaint} key={complaint.complaintId}/>
            ))}
          </div>
          <Link 
              href="/admin/reports"
              aria-description="all companies"
              className="group mt-4 w-fit ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
            >
              <span className="text-indigo-700 font-medium">Shiko të gjitha</span>
              <FaArrowsUpDown className="h-3.5 w-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className='bg-white p-6 rounded-lg shadow max-h-[600px] overflow-y-auto'>
          <div className='mb-4 flex flex-row justify-between items-center'>
            <div>
              <h2 className='text-lg font-semibold'>Kërkesat për kontribut</h2>
              <span className='text-gray-600 text-sm'>{stats.contributionsRequests.length} Kontribime</span>
            </div>
            <Link 
              href="/admin/contributions" 
              aria-description="all companies"
              className="group flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
            >
              <span className="text-indigo-700 font-medium">Shiko të gjitha</span>
              <FaArrowsUpDown className="h-3.5 w-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
            <div className='flex flex-col gap-4'>
              {stats.contributionsRequests ? ( stats.contributionsRequests.map((contribution) => (
                <ContributionRequestCard key={contribution.id} {...contribution} videoAttachments={contribution.videoAttacments}/>
              ))) : (
                <div>
                  No data available!
                </div>
              )}
            </div>
          <Link 
              href="/admin/contributions"
              aria-description="all companies"
              className="group mt-4 w-fit ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
            >
              <span className="text-indigo-700 font-medium">Shiko të gjitha</span>
              <FaArrowsUpDown className="h-3.5 w-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className='bg-white p-6 max-h-[600px] overflow-y-auto rounded-lg shadow relative'>
          <h2 className='text-lg font-semibold mb-4'>Regjistrat e përdoruesve</h2>
          <AdminUserLogs />
        </div>
      </div>
    </div>
  )
}