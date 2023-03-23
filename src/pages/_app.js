import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <div className="w-full h-full">
      {getLayout(<Component {...pageProps} />)}
    </div>
  )
}