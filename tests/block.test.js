const Block = require("../block");
const { GENESIS_DATA, MINE_RATE } = require('../config');
const cryptoHash = require("../crypto-hash");


describe('Block', () => {
    const timestamp = 3000;
    const lastHash = 'last-hash';
    const hash = 'new-hash';
    const data = ['blockchain', 'data'];
    const nonce = 1;
    const difficulty = 1;

    const block = new Block ({
        timestamp, lastHash, data, hash, nonce, difficulty
    });

    it ('hash `timestamp`, `lastHash`, `hash`, `data`, `nonce` and `difficulty` properties', () => {
        expect(block.timestamp).toEqual(timestamp)
        expect(block.lastHash).toEqual(lastHash)
        expect(block.hash).toEqual(hash)
        expect(block.data).toEqual(data)
        expect(block.nonce).toEqual(nonce)
        expect(block.difficulty).toEqual(difficulty)
    })

    describe('genesis()', () => {
        const genesisBlock = Block.genesis()

        it ('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true)
        })

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA)
        })
    })

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis()
        const data = {name: 'new-data'}
        const mineBlock = Block.mineBlock({ lastBlock, data })

        it('returns a Block instance', () => {
            expect(mineBlock instanceof Block).toBe(true)
        })

        it('sets the `lastHash` to be the `hash` of the last lastBlock', () => {
            expect(mineBlock.lastHash).toEqual(lastBlock.hash)
        })

        it('sets the `data`', () => {
            expect(mineBlock.data).toEqual(data)
        })

        it('sets a `timestamp`', () => {
            expect(mineBlock.timestamp).not.toEqual(undefined)
        })

        it('generates a `hash`', () => {
            expect(mineBlock.hash).not.toEqual(undefined)
        })

        it('creates a SHA-256 `hash` based on the input', () => {
            expect(mineBlock.hash)
                .toEqual(
                    cryptoHash(
                        mineBlock.timestamp, 
                        mineBlock.nonce, 
                        mineBlock.difficulty, 
                        lastBlock.hash, 
                        data
                    )
                )
        })

        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(mineBlock.hash.substring(0, mineBlock.difficulty))
                .toEqual('0'.repeat(mineBlock.difficulty))
        })
    })

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty+1)
        })

        it('lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 200
            })).toEqual(block.difficulty-1)
        })
    })
})
