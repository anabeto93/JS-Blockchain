const bodyParser = require('body-parser')
const express = require('express')
const Blockchain = require('./blockchain')
const PubSub = require('./pubsub')
const request = require('request')


const app = express()
app.use(bodyParser.json())
const blockchain = new Blockchain()
const pubsub = new PubSub({ blockchain })

const DEFAULT_PORT = 3000
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`



app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain)
})

app.post('/api/blocks', (req, res) => {
    const { data } = req.body

    blockchain.addBlock({ data })
    pubsub.broadcastChain()

    res.json({ message: "Block mined", error_code: 201 })
})


const syncChains = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body)

            console.log("Replacing chain on a sync with", rootChain)
            blockchain.replaceChain(rootChain)
        }
    })
}

let PEER_PORT

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}

const PORT = PEER_PORT || DEFAULT_PORT

app.listen(PORT, () => {
    console.log(`Listening on port localhost:${PORT}`)

    if (PORT !== DEFAULT_PORT) {
        syncChains()
    }
})
