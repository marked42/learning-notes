import { SimpleASTNode, ASTNodeType } from './ASTNode'
import { SimpleLexer } from './SimpleLexer'
import { Token, TokenType } from './Token'
import { TokenStream } from './TokenStream'
//  * 一个简单的语法解析器。
//  * 能够解析简单的表达式、变量声明和初始化语句、赋值语句。
//  * 它支持的语法规则为：
//  *
//  * programm -> intDeclare | expressionStatement | assignmentStatement
//  * intDeclare -> 'int' Id ( = additive) ';'
//  * expressionStatement -> addtive ';'
//  * addtive -> multiplicative ( (+ | -) multiplicative)*
//  * multiplicative -> primary ( (* | /) primary)*
//  * primary -> IntLiteral | Id | (additive)

class SimpleParser {
  constructor() {}

  parse(script: string) {
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenize(script)
  }

  matchIntDeclaration() {}

  matchExpressionStatement() {}

  matchAssignmentStatement() {}

  matchExpression() {}

  matchAdditiveExpression(tokens: TokenStream) {}

  matchMultiplicativeExpression() {}

  matchPrimaryExpression(tokens: TokenStream) {
    const token = tokens.read()

    if (token?.type === TokenType.IntLiteral) {
      return new SimpleASTNode(ASTNodeType.IntLiteral, null, null, token.text)
    }

    if (token?.type === TokenType.Identifier) {
      return new SimpleASTNode(ASTNodeType.Identifier, null, null, token.text)
    }

    if (token?.type === TokenType.Paren && token?.text === '(') {
      const node = this.matchAdditiveExpression(tokens)

      const nextToken = tokens.peek()
      if (nextToken?.type === TokenType.Paren && nextToken?.text === ')') {
        return node
      } else {
        throw new Error('failed to parse primary expression, lacking )')
      }
    }
  }
}
