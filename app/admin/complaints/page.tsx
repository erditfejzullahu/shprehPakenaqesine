import { DataTable } from "@/components/admin/DataTable"
import {columns} from "./columns"
import { getComplaints } from '@/lib/actions/admin'

export default async function ComplaintsPage() {
  const complaints = await getComplaints()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Complaints</h1>
      </div>
      <DataTable 
        columns={columns} 
        data={complaints} 
        searchKey="title" 
      />
    </div>
  )
}