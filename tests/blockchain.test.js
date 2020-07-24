const Blockchain = require('../blockchain')
const Block = require('../block')
const { cryptoHash } = require("../crypto-hash")


describe('Blockchain', () => {
    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain()
        newChain = new Blockchain()

        originalChain = blockchain.chain
    })

    it('contains a `chain` array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true)
    })

    it('should start with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis())
    })

    it('can add a block to the chain', () => {
        const newData = 'foo bar'
        blockchain.addBlock({ data: newData })

        expect(blockchain.chain[blockchain.chain.length -1].data).toEqual(newData)
    })

    describe('isValidChain()', () => {

        describe('when chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { data: 'how-evil' }

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
            })
        })

        describe('when the chain starts with the genesis block and has mutliple blocks', () => {

            beforeEach(() => {
                blockchain.addBlock({ data: {name: 'Lions' }})
                blockchain.addBlock({ data: {name: 'Tigers' }})
                blockchain.addBlock({ data: {name: 'Pussies' }})
            })

            describe('and the lastHash reference has changed', () => {
                it('returns false', () => {
                    //tamper with the lastHash
                    blockchain.chain[blockchain.chain.length - 1].lastHash = 'eveil-last-hash'

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            })

            describe('and the chain contains a block with an invalid field', () => {
                it('returns false', () => {
                    //modify the 2nd blockchain data
                    blockchain.chain[1].data = {name: 'Hacker', title: 'Obvious'}

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            })

            describe('and the chain is not tampered with', () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true)
                })
            })

            describe('and one element is not an instance of `Block`', () => {
                it('returns false', () => {
                    //change one item to be either a string or object
                    blockchain.chain[1] = {id: 20, title: "Not a Block", lastHash: 'hahahaa'}

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            })
        })
    })

    describe('replaceChain()', () => {
        let errorMock, logMock;

        beforeEach(() => {
            blockchain.addBlock({ data: { type: "IDEs" }})
            blockchain.addBlock({ data: { type: "Console" }})
            blockchain.addBlock({ data: { type: "Server" }})

            //The Same Copy
            newChain.addBlock({ data: { type: "IDEs" }})
            newChain.addBlock({ data: { type: "Console" }})
            newChain.addBlock({ data: { type: "Server" }})

            errorMock = jest.fn()
            logMock = jest.fn()

            global.console.error = errorMock
            global.console.log = logMock
        })

        describe('when the new chain is not longer', () => {

            beforeEach(() => {
                //shorten the new chain
                newChain.chain = newChain.chain.slice(0, newChain.chain.length -2)
                blockchain.replaceChain(newChain.chain)
            })

            it('does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalChain)
            })

            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled()
            })
        })

        describe('when the new chain is longer', () => {
            describe('and the new chain is invalid', () => {

                beforeEach(() => {
                    newChain.chain[0] = {name: "Hacked", content: "Not genesis block"}
                    newChain.addBlock({ data: "Just to be longer."})

                    blockchain.replaceChain(newChain.chain)
                })

                it('does not replace the chain', () => {
                    expect(blockchain.chain).toEqual(originalChain)
                })

                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled()
                })
            })

            describe('and the new chain is valid', () => {

                beforeEach(() => {
                    newChain.addBlock({ data: { name: "Marriage", missing: "Love", searching: "True love" }})

                    blockchain.replaceChain(newChain.chain)
                })

                it('replaces the chain', () => {
                    expect(blockchain.chain).not.toEqual(originalChain)
                    expect(blockchain.chain).toEqual(newChain.chain)
                })

                it('logs the replacement', () => {
                    expect(logMock).toHaveBeenCalled()
                })
            })
        })
    })
})
