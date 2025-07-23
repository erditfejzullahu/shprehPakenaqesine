import { Session } from 'next-auth';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import LogOut from './LogOut';
import ResponsiveHeader from './responsiveHeader';

const Header = ({session}: {session: Session | null}) => {

  return (
    <div className='mb-2'>
      <ResponsiveHeader session={session} />
    </div>
  );
};

export default Header;