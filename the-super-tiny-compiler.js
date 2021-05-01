function tokenize(input) {
  let char
  let current = 0

  // paren '(' ')'
  // number [0-9]
  // identifier [a-z]
  // whitespace
  const tokens = []
  while (current < input.length) {
    char = input[current]

    if (char === '(' || char === ')') {
      tokens.push({
        type: 'paren',
        value: char,
      })
      current++
      continue
    }

    const WHITESPACE = /\s/
    if (WHITESPACE.test(char)) {
      current++
      continue
    }

    const NUMBER = /[0-9]/
    if (NUMBER.test(char)) {
      let value = ''

      while (NUMBER.test(char)) {
        value += char
        current++
        char = input[current]
      }
      tokens.push({
        type: 'number',
        value,
      })
      continue
    }

    const NAME = /[a-z]/
    if (NAME.test(char)) {
      let value = ''

      while (NAME.test(char)) {
        value += char
        current++
        char = input[current]
      }
      tokens.push({
        type: 'name',
        value,
      })
      continue
    }

    throw new Error('unknown character ' + char)
  }

  return tokens
}

const input = '(add 2 (subtract 4 2))'
// const input = '(add 2 4 2)'

const tokens = tokenize(input)
console.log(tokens)

// Expression -> Identifier
// Expression -> NumberLiteral
// Expression -> CallExpression

// CallExpression -> ( Identifier CallExpressionParams )

// Params -> Param Params
// Params -> ''

// NumberLiteral
// Identifier

function parse(tokens) {
  let current = 0

  function parseExpression() {
    token = tokens[current]

    if (token.type === 'name') {
      return parseIdentifier()
    }

    if (token.type === 'number') {
      return parseNumberLiteral()
    }

    if (token.type === 'paren' && token.value === '(') {
      return parseCallExpression()
    }

    throw new Error('failed to parse expression')
  }

  function getToken() {
    return tokens[current]
  }

  function currentTokenIs(props) {
    const token = tokens[current]

    return Object.keys(props).every((key) => {
      return token[key] === props[key]
    })
  }

  function parseCallExpression() {
    token = tokens[current]

    if (token.type !== 'paren' && token.value !== '(') {
      throw new Error('failed to parse call expression')
    }

    current++
    const ast = {
      type: 'CallExpression',
      name: parseIdentifier().name,
      params: [],
    }

    while (!currentTokenIs({ type: 'paren', value: ')' })) {
      ast.params.push(parseExpression())
    }

    if (currentTokenIs({ type: 'paren', value: ')' })) {
      current++
      return ast
    }

    throw new Error(
      'failed to parse call expression, starting token must be (, got ',
      token
    )
  }

  function parseIdentifier() {
    token = tokens[current]

    if (!token || token.type !== 'name') {
      throw new Error('failed to parse identifier')
    }
    const value = token.value
    current++

    return {
      type: 'Identifier',
      name: value,
    }
  }

  function parseNumberLiteral() {
    token = tokens[current]
    if (!token || token.type !== 'number') {
      throw new Error('failed to parse number literal')
    }
    const value = token.value
    current++

    return {
      type: 'NumberLiteral',
      value: Number.parseInt(value),
    }
  }

  return parseExpression()
}

const ast = parse(tokens)
console.log(ast)
