const Transaction = require('../../wallet/transaction');
const Wallet = require('../../wallet');
const { verifySignature } = require('../../util');


describe('Transaction', () => {
    let transaction, senderWallet, recipient, amount;

    beforeEach(() => {
        senderWallet = new Wallet()
        recipient = 'recipient-public-key'
        amount = 5

        transaction = new Transaction({ senderWallet, recipient, amount})
    })

    it('has an `id`', () => {
        expect(transaction).toHaveProperty('id')
    })

    it('has an `outputMap`', () => {
        expect(transaction).toHaveProperty('outputMap')
    })
    
    it('has an `input`', () => {
        expect(transaction).toHaveProperty('input')
    })

    describe('outputMap', () => {
        
        it('outputs the amount to the `recipient`', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount)
        })

        it('outputs the remaining balance of the `senderWallet`', () => {
            expect(transaction.outputMap[senderWallet.publicKey])
                .toEqual(senderWallet.balance - amount)
        })
    })

    describe('input', () => {
    
        it('has a `timestamp` on the input property', () => {
            expect(transaction.input).toHaveProperty('timestamp')
        })

        it('sets the `amount` to the `senderWallet` balance', () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance)
        })

        it('sets the `address` to the `senderWallet` publicKey', () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey)
        })

        it('signs the input', () => {
            expect(
                verifySignature({
                    publicKey: senderWallet.publicKey,
                    data: transaction.outputMap,
                    signature: transaction.input.signature
                })
            ).toBe(true)
        })
    })

    describe('validTransaction()', () => {
        let errorMock;

        beforeEach(() => {
            errorMock = jest.fn()

            global.console.error = errorMock;
        })

        describe('when the transaction is valid', () => {
            it('returns true', () => {
                expect(Transaction.validTransaction(transaction)).toBe(true)
            })
        })

        describe('transaction is invalid', () => {
            describe('when the outputMap value is invalid', () => {
                it('returns false and logs and error', () => {
                    transaction.outputMap[senderWallet.publicKey] = 999999; //too much a value

                    expect(Transaction.validTransaction(transaction)).toBe(false)
                    
                    expect(errorMock).toHaveBeenCalled()
                })
            })

            describe('when the input signature is invalid', () => {
                it('returns false and logs and error', () => {
                    transaction.input.signature = new Wallet().sign('hahaha-evil-data')

                    expect(Transaction.validTransaction(transaction)).toBe(false)
                    
                    expect(errorMock).toHaveBeenCalled()
                })
            })
        })
    })
})
