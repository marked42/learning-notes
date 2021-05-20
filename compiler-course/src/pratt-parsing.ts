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
      : { type: 'op' as const, value: char }
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
  | { type: 'op'; value: string }

type ASTNode =
  | {
      type: 'NumericLiteral'
      value: number
    }
  | { type: 'BinaryExpression'; left: ASTNode; right: ASTNodeType }

export function expression(input: string, minBp = 0) {
  const tokenStream = new TokenStream(input)
  return _expression(tokenStream, minBp)
}

export function _expression(tokenStream: TokenStream, minBp = 0): ASTNode {
  const token = tokenStream.consume()
  if (!token) {
    throw new Error('expect token, encounter got early end of token stream')
  }

  let result: any = {
    type: 'NumericLiteral',
    value: token?.value,
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

  if (token.type === 'op') {
    if (token.value === '(') {
      const parenExpression = _expression(tokenStream)
      match({ type: 'op', value: ')' })
      return parenExpression
    }
  }

  while (true) {
    const nextOp = tokenStream.peek()
    if (nextOp === null || nextOp.type !== 'op') {
      break
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
      op: nextOp.value,
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
    '!': [7, undefined],
  }

  if (!map[char]) {
    throw new Error('bad operator')
  }

  return map[char]
}
