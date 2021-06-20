// Generated from ./src/grammar/Calculator.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { NumberExprContext } from "./CalculatorParser";
import { VariableExprContext } from "./CalculatorParser";
import { ParenExprContext } from "./CalculatorParser";
import { MinusExprContext } from "./CalculatorParser";
import { PowerExprContext } from "./CalculatorParser";
import { MulDivExprContext } from "./CalculatorParser";
import { AddSubExprContext } from "./CalculatorParser";
import { ProgContext } from "./CalculatorParser";
import { StatContext } from "./CalculatorParser";
import { AssignmentContext } from "./CalculatorParser";
import { ExprContext } from "./CalculatorParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `CalculatorParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface CalculatorVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by the `numberExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNumberExpr?: (ctx: NumberExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `variableExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariableExpr?: (ctx: VariableExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `parenExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParenExpr?: (ctx: ParenExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `minusExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMinusExpr?: (ctx: MinusExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `powerExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPowerExpr?: (ctx: PowerExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `mulDivExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMulDivExpr?: (ctx: MulDivExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `addSubExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAddSubExpr?: (ctx: AddSubExprContext) => Result;

	/**
	 * Visit a parse tree produced by `CalculatorParser.prog`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProg?: (ctx: ProgContext) => Result;

	/**
	 * Visit a parse tree produced by `CalculatorParser.stat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStat?: (ctx: StatContext) => Result;

	/**
	 * Visit a parse tree produced by `CalculatorParser.assignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignment?: (ctx: AssignmentContext) => Result;

	/**
	 * Visit a parse tree produced by `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpr?: (ctx: ExprContext) => Result;
}

