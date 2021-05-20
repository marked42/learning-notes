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
    const [_, rbp] = prefixBindingPower(token.value)

    result = {
      type: 'UnaryExpression',
      operator: token.value,
      value: _expression(tokenStream, rbp),
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

  if (token.type === 'operator') {
    if (token.value === '(') {
      const parenExpression = _expression(tokenStream)
      match({ type: 'operator', value: ')' })
      return parenExpression
    }
  }

  while (true) {
    const nextOp = tokenStream.peek()
    if (nextOp === null || nextOp.type !== 'operator') {
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

    const [leftBP, rightBP] = infixBindingPower(nextOp.value)
    if (leftBP < minBp) {
      // @ts-ignore
      break
    }

    tokenStream.consume()

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
    '+': [1, 2],
    '-': [1, 2],
    '*': [3, 4],
    '/': [3, 4],
    '^': [10, 9],
  }

  if (!map[char]) {
    throw new Error(`bad operator ${char}`)
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
