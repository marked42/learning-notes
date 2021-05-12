export interface ASTNode {
  type: ASTNodeType
  parent: ASTNode | null
  children: ASTNode[] | null
  text: string
}

export enum ASTNodeType {
  Program = 'Program',
  IntDeclaration = 'IntDeclaration',
  AssignmentStatement = 'AssignmentExpression',
  ExpressionStatement = 'ExpressionStatement',

  Primary = 'Primary',
  Multiplicative = 'Multiplicative',
  Additive = 'Additive',

  Identifier = 'Identifier',
  IntLiteral = 'IntLiteral',
}

export class SimpleASTNode implements ASTNode {
  constructor(
    public type: ASTNodeType,
    public parent: ASTNode | null,
    public children: ASTNode[] | null,
    public text: string
  ) {}
}
