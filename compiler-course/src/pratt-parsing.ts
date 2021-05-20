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
      type: 'number'
      value: number
    }
  | { type: 'binary'; left: ASTNode; right: ASTNodeType }

export function expression(input: string, minBp = 0) {
  const tokenStream = new TokenStream(input)
  return _expression(tokenStream, minBp)
}

export function _expression(tokenStream: TokenStream, minBp = 0): ASTNode {
  const token = tokenStream.consume()
  if (!token) {
    throw new Error('expect token, encounter got early end of token stream')
  }

  const left = {
    type: 'number',
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
    const nextOp = tokenStream.consume()
    if (nextOp === null || nextOp.type !== 'op') {
      break
    }

    const [leftBP, rightBP] = infixBindingPower(nextOp.value)
    if (leftBP < minBp) {
      // @ts-ignore
      return { type: 'number', value: token.value }
    }

    const right = _expression(tokenStream, rightBP)
    return {
      op: nextOp,
      // @ts-ignore
      left: { type: 'number', value: token.value },
      // @ts-ignore
      right,
    }
  }

  // @ts-ignore
  return left
}

function infixBindingPower(char: string) {
  const map: { [key: string]: [number, number] } = {
    '+': [1, 2],
    '-': [1, 2],
    '*': [3, 4],
    '/': [3, 4],
  }

  return map[char]
}

const result = expression('1 + 2')
console.log('result: ', result)
