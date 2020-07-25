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

    describe('update()', () => {
        let originalSignature, originalSenderAmount, nextRecipient, nextAmount;

        describe('and the amount is valid', () => {
            
            beforeEach(() => {
                originalSignature = transaction.input.signature
                originalSenderAmount = transaction.outputMap[senderWallet.publicKey]
                nextRecipient = 'next-recipient'
                nextAmount = 2

                transaction.update({ 
                    senderWallet, 
                    recipient: nextRecipient, 
                    amount: nextAmount
                })
            })

            it('outputs the amount to the next recipient', () => {
                expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount)
            })

            it('subtracts the amount from the original sender output amount', () => {
                expect(transaction.outputMap[senderWallet.publicKey])
                    .toEqual(originalSenderAmount - nextAmount)
            })

            it('maintains a total output that matches the input amount', () => {
                expect(
                    Object.values(transaction.outputMap).reduce((total, amt) => total + amt)
                ).toEqual(transaction.input.amount)
            })

            it('re-signs the transaction', () => {
                expect(transaction.input.signature).not.toEqual(originalSignature)
            })

            describe('and another update for the same recipient', () => {
                let addedAmount;

                beforeEach(() => {
                    addedAmount = 2

                    transaction.update({
                        senderWallet, recipient: nextRecipient, amount: addedAmount
                    })
                })

                it('adds to the recipient amount', () => {
                    expect(transaction.outputMap[nextRecipient])
                        .toEqual(nextAmount + addedAmount)
                })

                it('subtracts the amount from the original sender output amount', () => {
                    expect(transaction.outputMap[senderWallet.publicKey])
                        .toEqual(originalSenderAmount - nextAmount - addedAmount)
                })
            })
        })

        describe('and the amount is invalid', () => {
            it('throws an error', () => {
                expect(() => {
                    transaction.update({
                        senderWallet, recipient: 'innocent', amount: 99
                    })
                }).toThrow('Amount exceeds balance.')
            })

            describe('when amount is negative',() => {
                it('throws an error', () => {
                    expect(() => {
                        transaction.update({
                            senderWallet, recipient: 'innocent', amount: -20
                        })
                    }).toThrow('Cannot send negative or zero amount.')
                })
            })
        })
    })
})
