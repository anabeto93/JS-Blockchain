class Block {
    constructor({timestamp, lastHash, hash, data}) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
    }
}

const block1 = new Block({timestamp: '01/01/01', lastHash: 'last-hash', hash: 'new-hash', data: {name: 'test'}})
console.log(block1)