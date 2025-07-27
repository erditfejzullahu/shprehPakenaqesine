import { Session } from 'next-auth';
import { DynamicHeader } from './DynamicComponents';

const Header = ({session}: {session: Session | null}) => {

  return (
    <div className='mb-2'>
      <DynamicHeader session={session} />
    </div>
  );
};

export default Header;