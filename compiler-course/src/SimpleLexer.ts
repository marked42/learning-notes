import { SimpleToken, DfaState, TokenType, Token } from './Token'
import { StringCharacterStream, CharacterStream } from './CharacterStream'
import { TokenStream } from './TokenStream'

export class SimpleLexer {
  state = DfaState.Initial
  tokenText = ''
  tokenType: TokenType | null = null
  constructor() {}

  isValidOperatorCharacter(char: string) {
    const validOperatorCharacters = ['=', '>', '<', '+', '-', '*', '/']
    return validOperatorCharacters.includes(char)
  }

  isValidOperator(char: string) {
    const validOperators = ['=', '>=', '>', '==', '<=', '<', '+', '-', '*', '/']

    return validOperators.includes(char)
  }

  isAlpha(char: string) {
    const charCode = char.charCodeAt(0)
    const isLowerCase =
      'a'.charCodeAt(0) <= charCode && charCode <= 'z'.charCodeAt(0)
    const isUpperCase =
      'A'.charCodeAt(0) <= charCode && charCode <= 'Z'.charCodeAt(0)

    return isLowerCase || isUpperCase
  }

  isDigit(char: string) {
    const charCode = char.charCodeAt(0)
    return '0'.charCodeAt(0) <= charCode && charCode <= '9'.charCodeAt(0)
  }

  isAlphaNumeric(char: string) {
    return this.isAlpha(char) || this.isDigit(char)
  }

  isKeyword(text: string) {
    const keywords = ['if', 'else', 'int']

    return keywords.includes(text)
  }

  /**
   * 两个动作
   * 1. 接受上一次处理完成的token
   * 2. 为重新处理下一次token准备
   */
  resetState(char: string, tokens: Token[]) {
    // 上个token类型的处理
    if (this.tokenType !== null) {
      tokens.push(new SimpleToken(this.tokenType, this.tokenText))
    }

    // 循环结束后不再重新进行下一轮
    if (char === undefined) {
      return
    }

    this.state = DfaState.Initial
    this.tokenType = null
    this.tokenText = ''

    if (this.isValidOperatorCharacter(char)) {
      this.state = DfaState.Operator
      this.tokenType = TokenType.Operator
      this.tokenText += char
    } else if (this.isAlpha(char)) {
      this.state = DfaState.Identifier
      this.tokenText += char
      this.tokenType = TokenType.Identifier
    } else if (this.isDigit(char)) {
      this.state = DfaState.IntLiteral
      this.tokenText += char
      this.tokenType = TokenType.IntLiteral
    } else if (char === '"') {
      this.state = DfaState.StringLiteral
      this.tokenText += char
      this.tokenType = TokenType.StringLiteral
    } else if (char === '(' || char === ')') {
      this.state = DfaState.Paren
      this.tokenType = TokenType.Paren
      this.tokenText += char
    } else if (char === '{' || char === '}') {
      this.state = DfaState.Bracket
      this.tokenType = TokenType.Bracket
      this.tokenText += char
    } else if (char === ';') {
      this.state = DfaState.SemiColon
      this.tokenType = TokenType.SemiColon
      this.tokenText += char
    } else {
      // ignore all other
      // throw new Error('unexpected character ' + char)
    }
  }

  isWhitespace(char: string) {
    const whitespace = [' ', '\t', '\n', '\r']
    const is = whitespace.includes(char)
    return is
  }

  tokenize(input: string | CharacterStream) {
    const characterStream =
      typeof input === 'string' ? new StringCharacterStream(input) : input
    const tokens: Token[] = []

    try {
      let char: string
      while ((char = characterStream.read()) !== undefined) {
        switch (this.state) {
          case DfaState.Initial:
            this.resetState(char, tokens)
            break
          case DfaState.Operator:
            if (this.isValidOperatorCharacter(char)) {
              this.tokenText += char
            } else if (this.isValidOperator(this.tokenText)) {
              this.resetState(char, tokens)
            } else {
              // ignoring all unknown patterns including whitespace
            }
            break
          case DfaState.Identifier:
            if (this.isAlphaNumeric(char)) {
              this.tokenText += char
            } else {
              const type = this.isKeyword(this.tokenText)
                ? TokenType.Keyword
                : TokenType.Identifier
              this.tokenType = type
              this.resetState(char, tokens)
            }
            break
          case DfaState.IntLiteral:
            if (this.isDigit(char)) {
              this.tokenText += char
            } else {
              this.resetState(char, tokens)
            }
            break
          case DfaState.StringLiteral:
            if (char !== '"') {
              this.tokenText += char
            } else {
              this.resetState(char, tokens)
            }
            break
          case DfaState.Paren:
          case DfaState.Bracket:
          case DfaState.SemiColon:
            this.resetState(char, tokens)
            break
          default:
        }
      }

      this.resetState(char, tokens)
    } catch (e) {
      console.error(e)
    }

    return new TokenStream(tokens)
  }

  tokenStream(input: string | CharacterStream) {
    const tokens = this.tokenize(input)

    return new TokenStream(tokens)
  }
}
