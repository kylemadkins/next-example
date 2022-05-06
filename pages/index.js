import axios from 'axios'
import styles from '../styles/Home.module.css'

export async function getStaticProps() {
  const res = await fetch('http://localhost:8080')
  const posts = await res.json()
  const promises = posts.map((post, idx) => {
    let ext = post.image.split('.').pop()
    ext = ext === 'svg' ? 'svg+xml' : ext
    // Replace localhost w/ our server
    return axios
      .get(`http://localhost:8080/${post.image}`, {
        responseType: 'arraybuffer'
      })
      .then(response => {
        posts[idx] = {
          ...post,
          image: `data:image/${ext};base64,${Buffer.from(response.data, 'binary').toString('base64')}`
        }
      })
  })
  await Promise.all(promises)
  return {
    props: {
      posts,
    },
  }
}

export default function Home({ posts }) {
  return (
    <div className={styles.container}>
      {posts.map(post =>
        <div key={post.id}>
          <img src={post.image} alt={post.alt} />
        </div>
      )}
    </div>
  )
}
