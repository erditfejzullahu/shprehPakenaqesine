import { Session } from 'next-auth';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import { MdLogout } from "react-icons/md";
import LogOut from './LogOut';

const Header = ({session}: {session: Session | null}) => {

  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto flex justify-between items-center">
        <Link aria-description='ballina' href="/" className="text-xl font-black text-indigo-600">
          ShprehPakenaqesine
        </Link>
        <div className="flex gap-8">
          <Link aria-description='si funksjonon' href="/si-funksjonon" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Si funksjonon
          </Link>
          <Link aria-description='cmimore' href="/cmimore" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Cmimore
          </Link>
          <Link aria-description='verifikimi' href="/verifikimi" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Verifikimi
          </Link>
          <Link aria-description='na kontaktoni' href="/na-kontaktoni" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Na kontaktoni
          </Link>
          {session ? (<div className="flex flex-row gap-3 items-center">
            <Link href={'/profili'} >
              <FaUser size={24} color='#4f46e5'/>
            </Link>
            <LogOut/>
            </div>
          ) : (
            <Link href={'/kycuni'}>
              <FaUser size={24} color='#4f46e5'/>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;