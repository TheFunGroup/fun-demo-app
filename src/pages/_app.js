import '../styles/globals.css'
import { FunProvider } from '../contexts/funContext';

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <div className="w-full h-full">
      <FunProvider>
        {getLayout(<Component {...pageProps} />)}
      </FunProvider>
    </div>
  )
}