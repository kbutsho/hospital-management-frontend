import store, { persistor } from '@/redux/store';
import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import 'aos/dist/aos.css';
import 'aos/dist/aos.js';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.js");
  }, [])
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <main>
          <ToastContainer position="bottom-right" autoClose={4000} />
          {getLayout(<Component {...pageProps} />)}
        </main>
      </PersistGate>
    </Provider>
  )
}
