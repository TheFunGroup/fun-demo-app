import '../styles/globals.css'
import { FunProvider } from '../contexts/funContext';
import { WagmiConfig } from 'wagmi'
import wagmiClientBuilder from '../scripts/wagmiClientBuilder'
import { useState, useEffect } from 'react';

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

  const [wagmiClient, setWagmiClient] = useState()

  useEffect(() => {
    const client = wagmiClientBuilder();
    setWagmiClient(client)
  }, [])

  return (
    <div className="w-full h-full">
      {wagmiClient && (
        <WagmiConfig client={wagmiClient}>
          <FunProvider>
            {getLayout(<Component {...pageProps} />)}
          </FunProvider>
        </WagmiConfig>
      )}
    </div>
  )
}