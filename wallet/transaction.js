const uuid = require('uuid/v1')


class Transaction {
    constructor({ senderWallet, recipient, amount}) {
        // this.senderWallet = senderWallet
        // this.recipient = recipient
        // this.amount = amount
        this.outputMap = this.createOutputMap({ senderWallet, recipient, amount })
        this.id = uuid()
    }

    createOutputMap({ senderWallet, recipient, amount}) {
        const outputMap = {}

        outputMap[recipient] = amount
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount

        return outputMap
    }
}


module.exports = Transaction
