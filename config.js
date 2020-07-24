const INITIAL_DIFFICULTY = 3

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '----------',
    hash: 'no hash',
    data: {
        name: 'Richard Anabeto Opoku',
        job: 'CTO'
    },
    nonce: 0,
    difficulty: INITIAL_DIFFICULTY
}

module.exports = { GENESIS_DATA, INITIAL_DIFFICULTY }
