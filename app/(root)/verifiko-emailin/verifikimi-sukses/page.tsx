import { auth } from '@/auth'
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Button } from '@/components/ui/button';
import Video from '@/components/Video';
import { verifyCookieValue } from '@/lib/emails/sendEmailVerification';
import { Metadata } from 'next';
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Emaili u Verifikua me Sukses - ShfaqPakënaqësinë',
    description: 'Emaili juaj është verifikuar me sukses. Tani mund të vazhdoni me identifikimin në platformën ShfaqPakënaqësinë.',
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
    openGraph: {
      title: 'Emaili u Verifikua me Sukses',
      description: 'Emaili juaj është verifikuar me sukses. Klikoni për të vazhduar me identifikimin.',
      url: 'https://shfaqpakenaqesine.com/verifiko-emailin/verifikimi-sukses', // zëvendësoje me URL reale nëse ndryshon
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: 'Emaili u Verifikua me Sukses',
      description: 'Përfundoi me sukses verifikimi i email-it. Tani mund të identifikoheni.',
    },
  }
}


export default async function VerificationSuccessPage() {
  const session = await auth();
  if(session) redirect('/');
  const signedCookie = (await cookies()).get('email-verification')?.value
  const value = signedCookie ? verifyCookieValue(signedCookie) : null
  const parsedValue = JSON.parse(value || "null");  
    
  if(parsedValue === null || parsedValue?.error) {
      redirect('/')
  }

  return (
    <>
      <div className='mb-10'>
            <div className="w-full max-w-6xl mx-auto py-10 max-[640px]:pt-8! px-4 sm:px-6 lg:px-8 text-center shadow-lg rounded-b-2xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 leading-tight w-fit mx-auto relative tracking-tight">Emaili <span className='text-indigo-600'>u verifikua!</span>
                    <Video
                        src='/social-page.mp4'
                        className='size-10 absolute -top-7 -right-9 rotate-[30deg] max-[350px]:-right-7 max-[350px]:-top-9 max-[350px]:rotate-[20deg] max-[336px]:-right-5 max-[313px]:-right-3 max-[295px]:right-0 max-[295px]:rotate-0'
                    />
                </h1>
                <p className='text-gray-600 text-center max-[420px]:text-sm'>Tani keni akses në të gjitha vecorite e <Link href={'/'} className='text-indigo-600'>Shfaqpakënaqësinë</Link></p>
                <div className="mt-6 max-w-2xs mx-auto flex-1">
                  <Button asChild className='bg-indigo-700 hover:bg-indigo-900 w-full'>
                    <Link
                    href="/kycuni"
                    >
                    Vazhdo në identifikim
                    </Link>
                  </Button>
              </div>
            </div>
      </div>
      <GoogleAnalytics />
    </>
  )
}