import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/DataTable'
import {columns} from "./columns"
import { getCompanies } from '@/lib/actions/admin'
import Link from 'next/link'

export default async function CompaniesPage() {
  const companies = await getCompanies()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Companies</h1>
        <Button asChild>
          <Link href="/shto-kompani" target='_blank'>Add Company</Link>
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={companies} 
        searchKey="kompanite" 
      />
    </div>
  )
}