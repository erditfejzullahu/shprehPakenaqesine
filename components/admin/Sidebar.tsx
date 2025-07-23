import Link from 'next/link'
import { HomeIcon, BuildingIcon, UsersIcon, AlertCircleIcon, FileTextIcon, MailIcon, SettingsIcon } from 'lucide-react'
import { FaLocationArrow } from 'react-icons/fa'

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200 relative">
        <Link className='absolute right-4 top-3' href={"/"} target='_blank'><FaLocationArrow className='text-indigo-600 ' size={16}/></Link>
        <Link href={'/admin'} className="text-xl font-black text-gray-900 cursor-pointer">ShfaqPakenaqesine</Link>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/admin" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <HomeIcon className="w-5 h-5" />
              <span>Paneli</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/companies" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <BuildingIcon className="w-5 h-5" />
              <span>Kompanite</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/complaints" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <AlertCircleIcon className="w-5 h-5" />
              <span>Ankesat</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <UsersIcon className="w-5 h-5" />
              <span>Perdoruesit</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/reports" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <FileTextIcon className="w-5 h-5" />
              <span>Raportimet</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/contributions" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <FileTextIcon className="w-5 h-5" />
              <span>Kontribimet</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/subscribers" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <MailIcon className="w-5 h-5" />
              <span>Abonuesit</span>
            </Link>
          </li>
          <li className="pt-4 mt-4 border-t border-gray-200">
            <Link href="/admin/settings" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              <SettingsIcon className="w-5 h-5" />
              <span>Cilësimet</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}