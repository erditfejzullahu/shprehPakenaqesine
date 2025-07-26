import { auth } from '@/auth'
import { verifyCookieValue } from '@/lib/emails/sendEmailVerification';
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function VerificationSuccessPage() {
  const session = await auth();
  if(session) redirect('/');
  const signedCookie = (await cookies()).get('email-verification')?.value
  const value = signedCookie ? verifyCookieValue(signedCookie) : null
  if(value !== "success"){
    redirect('/')
  }

  return (
    <div className='py-10'>
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight leading-tight mb-4">Emaili u verifikua!</h1>
        <p className="mb-6">Emaili juaj është verifikuar me sukses.</p>
        <Link
            href="/kycuni"
            className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-900"
        >
            Vazhdo në identifikim
        </Link>
        </div>
    </div>
  )
}