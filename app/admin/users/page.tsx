import { DataTable } from '@/components/admin/DataTable'
import { columns } from './columns'
import { getUsers } from '@/lib/actions/admin'

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      <DataTable 
        columns={columns} 
        data={users} 
        searchKey="username" 
      />
    </div>
  )
}