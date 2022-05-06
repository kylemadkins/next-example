const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
  res.json([
    {
      id: 1,
      alt: "Vercel logo",
      image: '/vercel.svg'
    },
    {
      id: 2,
      alt: "A cat",
      image: '/cat1.png'
    },
    {
      id: 3,
      alt: "Another cat",
      image: '/cat2.jpg'
    },
    {
      id: 4,
      alt: "Yet another cat",
      image: '/cat3.jpeg'
    },
  ])
})

app.listen(8080)
