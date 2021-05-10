interface ASTNode {
  type: ASTNodeType
  parent: ASTNode
  children: ASTNode[] | null
}

enum ASTNodeType {
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
