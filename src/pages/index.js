import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ListPage from './listPage'

// export async function getStaticProps() {
//   // Call an external API endpoint to get posts.
//   // You can use any data fetching library
//   const res = await fetch('http://localhost:3000/sorted_result.json')
//   const posts = await res.json()

//   // By returning { props: { posts } }, the Blog component
//   // will receive `posts` as a prop at build time
//   return {
//     props: {
//       posts,
//     },
//   }
// }


const Home = (props) => {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          海离喫茶店群精华合集
        </p>
        <div>

          <a
            href="https://vercel.com/?utm_source=miriko-ch&utm_campaign=oss"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <div className={styles.content}>
        <ListPage />
      </div>
    </main>
  )
}

export default Home