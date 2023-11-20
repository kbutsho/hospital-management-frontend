import store from '@/redux/store';
import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { Poppins } from 'next/font/google'
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
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <Provider store={store}>
      <main>
        <ToastContainer position="bottom-right" autoClose={4000} />
        {getLayout(<Component {...pageProps} />)}
      </main>
    </Provider>
  )
}
