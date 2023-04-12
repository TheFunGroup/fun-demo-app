import '../styles/globals.css'
import { FunProvider } from '../contexts/funContext';
import { WagmiConfig } from 'wagmi'
import wagmiClientBuilder from '../scripts/wagmiClientBuilder'

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <div className="w-full h-full">
      <WagmiConfig client={wagmiClientBuilder()}>
        <FunProvider>
          {getLayout(<Component {...pageProps} />)}
        </FunProvider>
      </WagmiConfig>
    </div>
  )
}