const crypto = require('crypto')

const cryptoHash = (...args) => {
    const hash = crypto.createHash('sha256')

    let temp = "";
    
    if (args.length === 1) {
        if (args !== null && typeof(args) === 'string') {
            temp = JSON.stringify(args[0]).replace (/(^")|("$)/g, '');
        } else if(args !== null && typeof(args) === 'object') {
            temp = JSON.stringify(args[0]).replace (/(^")|("$)/g, '')
        }
    } else {
        temp = args.sort().map(e => {
            if (e !== null && typeof(e) === 'object') {
                return JSON.stringify(e).replace (/(^")|("$)/g, '')
            }
        }).join(' ');
    }
    

    hash.update(temp)

    return hash.digest('hex')
}

module.exports = cryptoHash;
