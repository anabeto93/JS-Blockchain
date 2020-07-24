const cryptoHash = require("./crypto-hash")


let lions = {
    timestamp: 1595604301685,
    lastHash: 'no hash',
    hash: '6e5650b148908174ec6117c6363e33942f80639a60b161ddb893b1390112da9f',
    data: { name: 'Lions' }
}

let hacker = {
    timestamp: 1595604301685,
    lastHash: 'no hash',
    hash: '6e5650b148908174ec6117c6363e33942f80639a60b161ddb893b1390112da9f',
    data: { name: 'Hacker', title: 'Obvious' }
}

let ld = cryptoHash(lions.timestamp, lions.lastHash, lions.data)
let dl = cryptoHash(lions.lastHash, lions.timestamp, lions.data)
let hd = cryptoHash(hacker.timestamp, hacker.lastHash, hacker.data)
let td = cryptoHash({ 'hate': 'hate' })
console.log(ld, dl, cryptoHash('foo'))
