import Link from 'next/link'
import { HomeIcon, BuildingIcon, UsersIcon, AlertCircleIcon, FileTextIcon, MailIcon, SettingsIcon } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full fixed">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/admin" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <HomeIcon className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/companies" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <BuildingIcon className="w-5 h-5" />
              <span>Companies</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/complaints" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <AlertCircleIcon className="w-5 h-5" />
              <span>Complaints</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <UsersIcon className="w-5 h-5" />
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/reports" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <FileTextIcon className="w-5 h-5" />
              <span>Reports</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/contributions" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <FileTextIcon className="w-5 h-5" />
              <span>Contributions</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/subscribers" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <MailIcon className="w-5 h-5" />
              <span>Subscribers</span>
            </Link>
          </li>
          <li className="pt-4 mt-4 border-t border-gray-200">
            <Link href="/admin/settings" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <SettingsIcon className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}