const express = require('express')
const path = require('path')
const app = express()

const PORT = 3000

app.use(express.static(path.join(__dirname, '..', 'app')))
app.get('/', (req, res) => {
  res.send('server running!!')
})

app.listen(PORT, ()=> {
  console.log(`Server listening on port ${PORT}`)
})
