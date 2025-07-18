import { AlertCircleIcon, BuildingIcon, MailIcon, UsersIcon } from 'lucide-react'
import { StatsCard } from '@/components/admin/StatsCard'
import { getDashboardStats } from '@/lib/actions/admin'
import ReportedComplaintsCard from '@/components/admin/ReportedComplaintsCard'

export default async function AdminDashboard() {
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
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Unapproved Complaints</h2>
          {/* Recent complaints table or chart */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow max-h-[400px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Reports Overview</h2>
          <div className='flex flex-col gap-4'>
            {stats.reportOverview.map((complaint) => (
              <ReportedComplaintsCard {...complaint} key={complaint.complaintId}/>
            ))}
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4'>Contribution Requests</h2>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4'>User Logs</h2>
        </div>
      </div>
    </div>
  )
}