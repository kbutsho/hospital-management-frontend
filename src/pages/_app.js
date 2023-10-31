import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { useEffect } from 'react';
import { Poppins } from 'next/font/google'

// const poppins = Poppins({
//   weight: ['400', '700', '900'],
//   style: ['normal', 'italic'],
//   subsets: ['latin'],
//   display: 'swap',
// })

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.js");
  }, [])

  return (
    <main>
      <Component {...pageProps} />
    </main>)
}
