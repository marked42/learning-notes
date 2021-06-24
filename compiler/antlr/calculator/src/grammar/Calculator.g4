grammar Calculator;

prog: stat+;

stat: expr | assignment ;

assignment: ID '=' expr;

expr
    : Number #numberExpr
    | ID #variableExpr
    | '(' expr ')' #parenExpr
    | '-' expr #minusExpr
    | expr ('^' expr)+ #powerExpr
    | expr ('*' | '/') expr #mulDivExpr
    | expr ('+' | '-') expr #addSubExpr
    ;

ID: [a-zA-Z] [a-zA-Z0-9]*;

WS: [\t \r\n]+ -> skip;

Number: '0' | [1-9][0-9]*;
