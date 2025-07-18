import { Sidebar } from '@/components/admin/Sidebar'
import { auth } from '@/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

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