export interface ASTNode {
  type: ASTNodeType
  parent: ASTNode
  children: ASTNode[] | null
  text: string
}

export enum ASTNodeType {
  Program,
  IntDeclaration,
  AssignmentStatement,
  ExpressionStatement,

  Primary,
  Multiplicative,
  Additive,

  Identifier,
  IntLiteral,
}

export class SimpleASTNode implements ASTNode {
  constructor(
    public type: ASTNodeType,
    public parent: ASTNode | null,
    public children: ASTNode[] | null,
    public text: string
  ) {}
}
