export interface Token {
  readonly type: TokenType
  readonly text: string
}

export enum TokenType {
  /**
   * =
   * >=
   * >
   * ==
   * <=
   * <
   * + - * /
   */
  Operator,

  Whitespace,

  Identifier,

  //   If,
  //   Else,
  //   Int,
  Keyword,

  IntLiteral,
  StringLiteral,

  /**
   * ( )
   */
  Paren,

  /**
   * Bracket
   */
  Bracket,

  SemiColon,
}

export class SimpleToken implements Token {
  constructor(private _type: TokenType, private _text: string) {}

  public get type() {
    return this._type
  }

  public set type(type: TokenType) {
    this._type = type
  }

  public get text() {
    return this._text
  }

  public set text(value: string) {
    this._text = value
  }
}

export enum DfaState {
  Initial,
  Operator,
  Identifier,
  IntLiteral,
  StringLiteral,

  Paren,
  Bracket,
  SemiColon,

  Whitespace,
}
