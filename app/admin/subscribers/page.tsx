import { DataTable } from '@/components/admin/DataTable'
import { columns } from './columns'
import { getSubscribers } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function SubscribersPage() {
  const subscribers = await getSubscribers()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscribers</h1>
        <Button asChild>
          <Link href="/admin/subscribers/export">Export CSV</Link>
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={subscribers} 
        searchKey="email" 
      />
    </div>
  )
}