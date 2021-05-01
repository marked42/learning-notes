/**
 * IDENTIFIER [a-zA-Z][a-zA-Z0-9]*
 * GT >
 * GE >=
 * Int  [0-9]+
 */
const States = {
  Initial: 0,
  Identifier: 2,
  GT: 3,
  GE: 4,
  Number: 5,
}
const Token = {
  Identifier: 0,
  GT: 1,
  GE: 2,
  Int: 3,
}

function tokenizer(input) {
  let state = States.Initial
  const tokens = []
  let current = 0

  const token = {
    type: Token.Initial,
    value: '',
  }
  while (current < input.length) {
    switch (state) {
      case States.Initial:
        if (/[0-9]/.test(input[current])) {
          token.value += input[current]
          token.type = Token.Int
          state = States.Number
          current++
        } else if (input[current] === '>') {
          token.value += input[current]
          token.type = States.GT
          state = States.GT
          current++
        } else if (/[a-zA-Z]/.test(input[current])) {
          token.value += input[current]
          token.type = Token.Identifier
          state = States.Identifier
          current++
        } else {
          throw new Error('failed ')
        }
        break
      case States.Number:
        if (/0-9/.test(input[current])) {
          tokenText += input[current]
          current++
        } else {
          tokens.push({ ...token })
          token.value = ''
          state = States.Initial
          current++
        }
        break
      case States.Identifier:
        if (/[a-zA-Z0-9]/.test(input[current])) {
          token.type = Token.Identifier
          token.value += input[current]
          current++
        } else {
          tokens.push({ ...token })
          token.value = ''
          state = States.Initial
          current++
        }
        break
      case States.GT:
        if (input[current] === '=') {
          token.type = Token.GE
          token.value += input[current]
          current++
        } else {
          tokens.push({ ...token })
          token.value = ''
          state = States.Initial
          current++
        }
        break
      case States.GE:
        tokens.push({ ...token })
        token.value = ''
        state = States.Initial
        current++
        break
      default:
        break
    }
  }

  return tokens
}

const input = 'age >= 45'
const tokens = tokenizer(input)
console.log('tokens: ', input)
