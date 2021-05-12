import { Token } from './Token'

export class TokenStream {
  private position = 0
  constructor(private tokens: Token[]) {}

  read() {
    if (this.position >= this.tokens.length) {
      return null
    }

    return this.tokens[this.position++]
  }

  unread() {
    if (this.position > 0) {
      this.position--
    }
  }

  peek() {
    if (this.position < this.tokens.length) {
      return this.tokens[this.position]
    }

    return null
  }

  getPosition() {
    return this.position
  }

  setPosition(pos: number) {
    if (pos >= 0 && pos < this.tokens.length) {
      this.position = pos
    }
  }
}
