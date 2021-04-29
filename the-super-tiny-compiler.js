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
// console.log(tokens)

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

  return {
    type: 'Program',
    body: [parseExpression()],
  }
}

const ast = parse(tokens)
console.log(ast)

function traverser(node, visitor) {
  function traverseArray(array, parent) {
    array.forEach((child) => {
      traverseNode(child, parent)
    })
  }

  function traverseNode(node, parent) {
    const method = visitor[node.type]
    if (typeof method === 'function') {
      method(node, parent)
    }

    switch (node.type) {
      case 'Program':
        traverseArray(node.body, node)
        break

      case 'CallExpression':
        traverseArray(node.params, node)
        break

      case 'NumberLiteral':
        break

      default:
        throw new Error(node.type)
    }
  }

  traverseNode(node, null)
}

// traverser(ast, {
//   Program(node, parent) {
//     console.log(node)
//   },
//   CallExpression(node, parent) {
//     console.log(node)
//   },
//   NumberLiteral(node, parent) {
//     console.log(node)
//   },
// })

function transformer(ast) {
  const newAst = {
    type: 'Program',
    body: [],
  }
  ast._context = newAst.body

  traverser(ast, {
    CallExpression(node, parent) {
      let expression = {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: node.name,
        },
        params: [],
      }

      node._context = expression.params

      if (parent.type !== 'CallExpression') {
        expression = {
          type: 'ExpressionStatement',
          expression,
        }
      }

      parent._context.push(expression)
    },
    NumberLiteral(node, parent) {
      parent._context.push({
        type: 'NumberLiteral',
        value: node.value,
      })
    },
  })

  return newAst
}

const newAst = transformer(ast, null)
console.log(newAst)

function codeGenerator(ast) {
  switch (ast.type) {
    case 'Program':
      return ast.body.map(codeGenerator).join('\n')

    case 'ExpressionStatement':
      return codeGenerator(ast.expression) + ';'

    case 'CallExpression':
      return (
        ast.callee.name + '(' + ast.params.map(codeGenerator).join(', ') + ')'
      )

    case 'Identifier':
      return ast.name

    case 'NumberLiteral':
      return ast.value

    default:
      throw new Error('invalid')
  }
}

const output = 'add(2, subtract(4, 2))'
console.log(codeGenerator(newAst))

class NodeSerializer {
  constructor() {}

  generate() {
    throw new Error('unimplemented')
  }
}

class Program extends NodeSerializer {
  constructor(body) {
    super()
    this.body = body
  }

  generate() {
    return this.body
      .map((node) => node.generate())
      .map((s) => s + '\n')
      .join('')
  }
}

class ExpressionStatement extends NodeSerializer {
  constructor(expression) {
    super()
    this.expression = expression
  }

  generate() {
    return this.expression.generate() + ';'
  }
}

class CallExpression extends NodeSerializer {
  constructor(callee, params) {
    super()
    this.callee = callee
    this.params = params
  }

  generate() {
    return (
      this.callee.generate() +
      '(' +
      this.params.map((p) => p.generate()).join(',') +
      ')'
    )
  }
}

class NumberLiteral extends NodeSerializer {
  constructor(value) {
    super()
    this.value = value
  }

  generate() {
    return this.value
  }
}

class Identifier extends NodeSerializer {
  constructor(name) {
    super()
    this.name = name
  }

  generate() {
    return this.name
  }
}

function transformerV2(ast) {
  const newAst = new Program([])
  ast._context = newAst.body

  traverser(ast, {
    CallExpression(node, parent) {
      let expression = new CallExpression(new Identifier(node.name), [])

      node._context = expression.params

      if (parent.type !== 'CallExpression') {
        expression = new ExpressionStatement(expression)
      }

      parent._context.push(expression)
    },
    NumberLiteral(node, parent) {
      parent._context.push(new NumberLiteral(node.value))
    },
  })

  return newAst
}

const newAstV2 = transformerV2(ast)
console.log(newAstV2)
const outputV2 = newAstV2.generate()
console.log(outputV2)
