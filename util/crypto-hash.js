const crypto = require('crypto')

const hexToBinary = require('hex-to-binary')

const cryptoHash = (...args) => {
    const hash = crypto.createHash('sha256')

    let temp = "";

    if (args.length === 1) {
        if (args !== null && typeof(args[0]) === 'string') {
            temp = args[0]
        } else if(args !== null && typeof(args[0]) === 'object') {
            temp = JSON.stringify(args[0]).replace (/(^")|("$)/g, '')
        }
    } else {
        temp = args.sort().map(e => {
            if (e !== null && typeof(e) === 'object') {
                return JSON.stringify(e)
            }

            return e
        }).join(' ');
    }
    
    hash.update(temp)

    return hash.digest('hex')
}

module.exports = { cryptoHash, hexToBinary }
