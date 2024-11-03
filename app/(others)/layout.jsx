import localFont from 'next/font/local'
import '../globals.css'
import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import Loader from '@/components/Loader'
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})

const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata = {
  title: 'Linksy',
  description:
    'Linksy is a next-generation social media platform crafted to foster meaningful connections and enrich user engagement. Developed with Next.js, Clerk, and MongoDB, Linksy emphasizes both user privacy and a tailored experience, allowing users to connect, share, and discover content relevant to their interests within a secure environment.'
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ClerkLoading>
            <Loader />
          </ClerkLoading>
          <ClerkLoaded>
            <div className="flex justify-between max-w-6xl mx-auto">
              <div className="hidden sm:inline border-r h-screen sticky top-0">
                <LeftSidebar />
              </div>

              <div className="flex-1">{children}</div>

              <div className="lg:flex-col p-3 h-screen border-l hidden lg:flex w-[24rem]">
                <RightSidebar />
              </div>
            </div>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  )
}
