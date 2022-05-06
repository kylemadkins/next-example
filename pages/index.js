import styles from '../styles/Home.module.css'

export async function getStaticProps() {
  const fs = require('fs-extra')
  const uuid = require('uuid')
  const http = require('http')

  const res = await fetch('http://localhost:8080')
  const posts = await res.json()

  if (process.env.STATIC === 'false') {
    return {
      props: {
        posts: posts.map(post => ({
          ...post,
          // Replace localhost w/ our server. Probably store in an ENV variable
          image: `http://localhost:8080${post.image}`
        }))
      },
    }
  }

  fs.emptyDirSync('./images')

  const promises = posts.map((post, idx) => {
    let ext = post.image.split('.').pop()
    let filename = `${uuid.v4()}.${ext}`
    const writer = fs.createWriteStream(`./images/${filename}`)
    // Replace localhost w/ our server
    return new Promise((resolve) => {
      http.get(`http://localhost:8080${post.image}`, function(response) {
        response.pipe(writer)
        writer.on("finish", () => {
          posts[idx] = {
            ...post,
            image: `../images/${filename}`
          }
          resolve()
        })
      })
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
          <img src={post.image} alt={posts.alt} />
        </div>
      )}
    </div>
  )
}
