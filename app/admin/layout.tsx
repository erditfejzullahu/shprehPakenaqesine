import { Sidebar } from '@/components/admin/Sidebar'
import { isAdmin } from '@/lib/utils/isAdmin'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await isAdmin('/')
    
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mx-auto ">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}