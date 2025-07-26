import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const page = async ({params}: {params: Promise<{token: string}>}) => {
    const session = await auth()
    if(session) redirect('/');
    const {token} = await params;
    redirect(`/api/emailVerification/verify/${token}`)
}

export default page