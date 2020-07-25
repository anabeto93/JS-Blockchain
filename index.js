const bodyParser = require('body-parser')
const express = require('express')
const Blockchain = require('./blockchain')
const PubSub = require('./pubsub')

const app = express()
app.use(bodyParser.json())
const blockchain = new Blockchain()
const pubsub = new PubSub({ blockchain })

pubsub.broadcastChain()


app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain)
})

app.post('/api/mine', (req, res) => {
    const { data } = req.body

    blockchain.addBlock({ data })

    res.json({ message: "Block mined", error_code: 201 })
})

const DEFAULT_PORT = 3000
let PEER_PORT

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}

const PORT = PEER_PORT || DEFAULT_PORT

app.listen(PORT, () => {
    console.log(`Listening on port localhost:${PORT}`)
})
