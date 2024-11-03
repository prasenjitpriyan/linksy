import '.././globals.css'

import Loader from '@/components/Loader'
import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/nextjs'

export const metadata = {
  title: 'Linksy',
  description:
    'Linksy is a next-generation social media platform crafted to foster meaningful connections and enrich user engagement. Developed with Next.js, Clerk, and MongoDB, Linksy emphasizes both user privacy and a tailored experience, allowing users to connect, share, and discover content relevant to their interests within a secure environment.'
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ClerkLoading>
            <Loader />
          </ClerkLoading>
          <ClerkLoaded>{children}</ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  )
}
