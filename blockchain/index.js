const Block = require("./block");
const { cryptoHash } = require("../util")


class Blockchain {
    constructor() {
        this.chain = [ Block.genesis() ]
    }

    addBlock({ data }) {
        const block = Block.mineBlock({ 
            lastBlock: this.chain[this.chain.length -1 ],
            data
        })

        this.chain.push(block)
    }

    static isValidChain(chain) {

        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false

        for(let i = 1; i < chain.length; i++) {
            const block = chain[i];

            //each must be an instance of Block
            if (!(block instanceof Block)) return false

            const actualLashHash = chain[i-1].hash
            const lastDifficulty = chain[i-1].difficulty

            const { timestamp, lastHash, hash, data, nonce, difficulty } = block

            if (Math.abs(lastDifficulty - difficulty) > 1) return false
            //current lastHash versus the hash on the last block
            if (lastHash !== actualLashHash) return false

            //if one item (data) has been tampered with
            let validHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)

            if (validHash !== hash) return false
        }

        return true
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.error("The chain must be longer.")
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error("The chain must be valid.")
            return;
        }

        console.log("Replacing the chain", chain)
        this.chain = chain
    }
}

module.exports = Blockchain;
