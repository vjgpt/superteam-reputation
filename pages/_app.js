import 'bootstrap/dist/css/bootstrap.css'
import Head from 'next/head'
import '../styles/globals.css'
import Layout from '../components/Layout'
import '../styles/Navbar.module.css'
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Reputation Leaderboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></Script>
        <Script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></Script>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js"></Script>
      <Layout>
          <Component {...pageProps} />
      </Layout>
   </>
  )
}

export default MyApp
