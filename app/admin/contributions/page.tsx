import { DataTable } from '@/components/admin/DataTable'
import { columns } from './columns'
import { getContributions } from '@/lib/actions/admin'

export default async function ContributionsPage() {
  const contributions = await getContributions()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contributions</h1>
      </div>
      <DataTable 
        columns={columns} 
        data={contributions} 
        searchKey="complaintId" 
      />
    </div>
  )
}