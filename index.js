const bodyParser = require('body-parser')
const express = require('express')
const Blockchain = require('./blockchain')

const app = express()
app.use(bodyParser.json())
const blockchain = new Blockchain()


app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain)
})

app.post('/api/mine', (req, res) => {
    const { data } = req.body

    blockchain.addBlock({ data })

    res.json({ message: "Block mined", error_code: 201 })
})


const PORT = 3000
app.listen(PORT, () => {
    console.log(`Listening on port localhost:${PORT}`)
})
