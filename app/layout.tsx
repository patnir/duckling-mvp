// TODO: Search why this is not working. I had to put an import at globals.sccs for the font to work
import { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { PHProvider } from './providers'

import { ClerkProvider } from '@clerk/nextjs'
import dynamic from 'next/dynamic'
import './globals.scss'
// import ducklingTheme from "./style/theme/theme" // Here whenever we decide to move to our own theme

const roboto = Roboto({ subsets: ['latin'],
  display: 'swap',
  weight: [
  '300', '400', '500', '700', '900'
  ]
})

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
})

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: {
    template: '%s | Duckling',
    default: 'Duckling',
  },
  description:
    'Duckling Sales Platform: To sign up for a demo email john@getduckling.com',
  applicationName: 'Duckling Sales Platform',
  authors: [
    {
      url: 'https://getduckling.com',
      name: 'Duckling',
    },
  ],
  keywords: [
    'Duckling',
    'Sales',
    'Platform',
    'Home Electrification',
    'Contractor SaaS',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
            <PHProvider>
      <html lang="en" className={roboto.className}>
      <PostHogPageView /> 
        <body>{children}</body>
      </html>
      </PHProvider>
    </ClerkProvider>
  )
}
