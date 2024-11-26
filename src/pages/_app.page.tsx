import type { AppProps } from 'next/app'
import { globaStyles } from '../styles/global'
import { SessionProvider } from 'next-auth/react'

globaStyles()
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
