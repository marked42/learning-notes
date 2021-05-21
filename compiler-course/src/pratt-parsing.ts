import { ASTNodeType } from './ASTNode'

class TokenStream {
  private position = 0
  constructor(private input: string) {}

  peek() {
    while (/\s/.test(this.input[this.position]) && this.hasNext()) {
      this.position++
    }

    if (this.position >= this.input.length) {
      return null
    }

    const char = this.input[this.position]

    const isDigit = /\d/.test(char)

    return isDigit
      ? { type: 'number' as const, value: Number(char) }
      : { type: 'operator' as const, value: char }
  }

  consume() {
    if (!this.hasNext()) {
      return null
    }
    const token = this.peek()
    this.position++
    return token
  }

  getPosition() {
    return this.position
  }

  setPosition(position: number) {
    this.position = position
  }

  hasNext() {
    return this.position < this.input.length
  }
}

type Token =
  | {
      type: 'number'
      value: number
    }
  | { type: 'operator'; value: string }

type ASTNode =
  | {
      type: 'NumericLiteral'
      value: number
    }
  | {
      type: 'BinaryExpression'
      operator: string
      left: ASTNode
      right: ASTNode
    }
  | { type: 'UnaryExpression'; operator: string; value: ASTNode }
  | { type: 'MemberExpression'; object: ASTNode; property: ASTNode }
  | {
      type: 'ConditionalExpression'
      test: ASTNode
      consequent: ASTNode
      alternate: ASTNode
    }

export function expression(input: string, minBp = 0) {
  const tokenStream = new TokenStream(input)
  return _expression(tokenStream, minBp)
}

export function _expression(tokenStream: TokenStream, minBp = 0): ASTNode {
  const token = tokenStream.consume()
  if (!token) {
    throw new Error('expect token, encounter EOF token')
  }

  let result: ASTNode

  if (token.type === 'operator') {
    if (token.value === '(') {
      result = _expression(tokenStream, 0)
      match({ type: 'operator', value: ')' })
    } else {
      const [_, rbp] = prefixBindingPower(token.value)

      result = {
        type: 'UnaryExpression',
        operator: token.value,
        value: _expression(tokenStream, rbp),
      }
    }
  } else {
    result = {
      type: 'NumericLiteral',
      value: token?.value,
    }
  }

  function match(targetToken: Token) {
    const token = tokenStream.peek()

    if (token === null && targetToken === null) {
      tokenStream.consume()
      return
    }

    if (
      token &&
      (token.type !== targetToken.type || token.value !== targetToken.value)
    ) {
      throw new Error(`expect to match token ${targetToken}, get ${token}`)
    }
    tokenStream.consume()
  }

  while (true) {
    const nextOp = tokenStream.peek()
    if (nextOp === null || nextOp.type !== 'operator') {
      break
    }

    if (nextOp.value === '[') {
      tokenStream.consume()
      result = {
        type: 'MemberExpression',
        object: result,
        property: _expression(tokenStream, 0),
      }
      match({ type: 'operator', value: ']' })
      break
    }

    // 在这个位置遇到右括号，应该结束递归
    if (nextOp.value === ')' || nextOp.value === ']') {
      break
    }

    const postfix = postfixBindingPower(nextOp.value)
    if (postfix && postfix[0]) {
      if (postfix[0] < minBp) {
        break
      }

      result = {
        type: 'UnaryExpression',
        operator: nextOp.value,
        value: result,
      }
      tokenStream.consume()
      continue
    }

    // 这里碰到:应该直接结束
    if (nextOp.value === ':') {
      break
    }

    const [leftBP, rightBP] = infixBindingPower(nextOp.value)
    if (leftBP < minBp) {
      // @ts-ignore
      break
    }
    tokenStream.consume()

    if (nextOp.value === '?') {
      // 注意这里又从0开始
      const consequent = _expression(tokenStream, 0)
      match({ type: 'operator', value: ':' })
      // 这里继续使用rbp
      const alternate = _expression(tokenStream, rightBP)
      result = {
        type: 'ConditionalExpression',
        test: result,
        consequent,
        alternate,
      }
      break
    }

    const right = _expression(tokenStream, rightBP)
    result = {
      type: 'BinaryExpression',
      operator: nextOp.value,
      // @ts-ignore
      left: result,
      // @ts-ignore
      right,
    }
  }

  // @ts-ignore
  return result
}

interface InfixBindingPowerMap {
  [key: string]: [number, number]
}

function infixBindingPower(char: string) {
  const map: InfixBindingPowerMap = {
    '=': [2, 1],
    '?': [4, 3],
    '+': [5, 6],
    '-': [5, 6],
    '*': [7, 8],
    '/': [7, 8],
    '^': [14, 13],
  }

  return map[char]
}

interface PrefixBindingPowerMap {
  [key: string]: [undefined, number]
}

function prefixBindingPower(char: string) {
  const map: PrefixBindingPowerMap = {
    '+': [undefined, 5],
    '-': [undefined, 5],
  }

  if (!map[char]) {
    throw new Error(`bad operator ${char}`)
  }

  return map[char]
}

interface PostfixBindingPowerMap {
  [key: string]: [number, undefined]
}

function postfixBindingPower(char: string) {
  const map: PostfixBindingPowerMap = {
    // factorial 阶乘
    '!': [7, undefined],
  }

  // 非法的postfix operator不抛异常，因为会继续尝试是不是binary operator
  return map[char]
}
expression('1 ? 2 : 3')

// TODO: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
