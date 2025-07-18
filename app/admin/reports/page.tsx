import { DataTable } from '@/components/admin/DataTable'
import { columns } from './columns'
import { getReports } from '@/lib/actions/admin'

export default async function ReportsPage() {
  const reports = await getReports()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>
      <DataTable 
        columns={columns} 
        data={reports} 
        searchKey="title" 
      />
    </div>
  )
}