import '@/styles/less/index.less'
import Head from 'next/head'

const App = ({ Component, pageProps }) => {
  const head = <Head>
    <title>海离喫茶店群精华合集</title>
  </Head>
  return (
    <>
      {head}
      <Component {...pageProps} />
    </>
  )
}

export default App
