import { auth } from '@/auth';
import { verifyCookieValue } from '@/lib/emails/sendEmailVerification';
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function VerificationErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string; email?: string }>
}) {
    const session = await auth()
    if(session) redirect('/')
    const {error, email} = await searchParams;
    const signedCookie = (await cookies()).get('email-verification')?.value
    const value = signedCookie ? verifyCookieValue(signedCookie) : null;
    if(value !== "error"){
        redirect('/')
    }

  return (
    <div className='py-10'>
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 tracking-tight leading-tight">Verifikimi dështoi</h1>
        <p className="mb-4 text-red-600">{error}</p>
        <div className="space-y-3">
            {error !== "Token verifikimi invalid" &&<Link
            href={`/api/emailVerification/resend/${email}`}
            className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-900 block"
            >
            Ridërgo verifikimin e emailit
            </Link>}
            <Link
            href="/na-kontaktoni"
            className="block px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
            Na kontaktoni
            </Link>
        </div>
        </div>
    </div>
  )
}