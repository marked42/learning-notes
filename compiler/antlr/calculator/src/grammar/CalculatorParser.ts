// Generated from ./src/grammar/Calculator.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { CalculatorListener } from "./CalculatorListener";
import { CalculatorVisitor } from "./CalculatorVisitor";


export class CalculatorParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly ID = 9;
	public static readonly WS = 10;
	public static readonly Number = 11;
	public static readonly RULE_prog = 0;
	public static readonly RULE_stat = 1;
	public static readonly RULE_assignment = 2;
	public static readonly RULE_expr = 3;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"prog", "stat", "assignment", "expr",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'='", "'('", "')'", "'-'", "'^'", "'*'", "'/'", "'+'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, "ID", "WS", "Number",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(CalculatorParser._LITERAL_NAMES, CalculatorParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return CalculatorParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "Calculator.g4"; }

	// @Override
	public get ruleNames(): string[] { return CalculatorParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return CalculatorParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(CalculatorParser._ATN, this);
	}
	// @RuleVersion(0)
	public prog(): ProgContext {
		let _localctx: ProgContext = new ProgContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, CalculatorParser.RULE_prog);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 9;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 8;
				this.stat();
				}
				}
				this.state = 11;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CalculatorParser.T__1) | (1 << CalculatorParser.T__3) | (1 << CalculatorParser.ID) | (1 << CalculatorParser.Number))) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public stat(): StatContext {
		let _localctx: StatContext = new StatContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, CalculatorParser.RULE_stat);
		try {
			this.state = 15;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 1, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 13;
				this.expr(0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 14;
				this.assignment();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public assignment(): AssignmentContext {
		let _localctx: AssignmentContext = new AssignmentContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, CalculatorParser.RULE_assignment);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 17;
			this.match(CalculatorParser.ID);
			this.state = 18;
			this.match(CalculatorParser.T__0);
			this.state = 19;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public expr(): ExprContext;
	public expr(_p: number): ExprContext;
	// @RuleVersion(0)
	public expr(_p?: number): ExprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ExprContext = new ExprContext(this._ctx, _parentState);
		let _prevctx: ExprContext = _localctx;
		let _startState: number = 6;
		this.enterRecursionRule(_localctx, 6, CalculatorParser.RULE_expr, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 30;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CalculatorParser.Number:
				{
				_localctx = new NumberExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 22;
				this.match(CalculatorParser.Number);
				}
				break;
			case CalculatorParser.ID:
				{
				_localctx = new VariableExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 23;
				this.match(CalculatorParser.ID);
				}
				break;
			case CalculatorParser.T__1:
				{
				_localctx = new ParenExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 24;
				this.match(CalculatorParser.T__1);
				this.state = 25;
				this.expr(0);
				this.state = 26;
				this.match(CalculatorParser.T__2);
				}
				break;
			case CalculatorParser.T__3:
				{
				_localctx = new MinusExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 28;
				this.match(CalculatorParser.T__3);
				this.state = 29;
				this.expr(4);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 47;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 5, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 45;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 4, this._ctx) ) {
					case 1:
						{
						_localctx = new MulDivExprContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, CalculatorParser.RULE_expr);
						this.state = 32;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 33;
						_la = this._input.LA(1);
						if (!(_la === CalculatorParser.T__5 || _la === CalculatorParser.T__6)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 34;
						this.expr(3);
						}
						break;

					case 2:
						{
						_localctx = new AddSubExprContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, CalculatorParser.RULE_expr);
						this.state = 35;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 36;
						_la = this._input.LA(1);
						if (!(_la === CalculatorParser.T__3 || _la === CalculatorParser.T__7)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 37;
						this.expr(2);
						}
						break;

					case 3:
						{
						_localctx = new PowerExprContext(new ExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, CalculatorParser.RULE_expr);
						this.state = 38;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 41;
						this._errHandler.sync(this);
						_alt = 1;
						do {
							switch (_alt) {
							case 1:
								{
								{
								this.state = 39;
								this.match(CalculatorParser.T__4);
								this.state = 40;
								this.expr(0);
								}
								}
								break;
							default:
								throw new NoViableAltException(this);
							}
							this.state = 43;
							this._errHandler.sync(this);
							_alt = this.interpreter.adaptivePredict(this._input, 3, this._ctx);
						} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
						}
						break;
					}
					}
				}
				this.state = 49;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 5, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 3:
			return this.expr_sempred(_localctx as ExprContext, predIndex);
		}
		return true;
	}
	private expr_sempred(_localctx: ExprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 2);

		case 1:
			return this.precpred(this._ctx, 1);

		case 2:
			return this.precpred(this._ctx, 3);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\r5\x04\x02\t" +
		"\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x03\x02\x06\x02\f\n\x02" +
		"\r\x02\x0E\x02\r\x03\x03\x03\x03\x05\x03\x12\n\x03\x03\x04\x03\x04\x03" +
		"\x04\x03\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03" +
		"\x05\x03\x05\x05\x05!\n\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03" +
		"\x05\x03\x05\x03\x05\x03\x05\x06\x05,\n\x05\r\x05\x0E\x05-\x07\x050\n" +
		"\x05\f\x05\x0E\x053\v\x05\x03\x05\x02\x02\x03\b\x06\x02\x02\x04\x02\x06" +
		"\x02\b\x02\x02\x04\x03\x02\b\t\x04\x02\x06\x06\n\n\x029\x02\v\x03\x02" +
		"\x02\x02\x04\x11\x03\x02\x02\x02\x06\x13\x03\x02\x02\x02\b \x03\x02\x02" +
		"\x02\n\f\x05\x04\x03\x02\v\n\x03\x02\x02\x02\f\r\x03\x02\x02\x02\r\v\x03" +
		"\x02\x02\x02\r\x0E\x03\x02\x02\x02\x0E\x03\x03\x02\x02\x02\x0F\x12\x05" +
		"\b\x05\x02\x10\x12\x05\x06\x04\x02\x11\x0F\x03\x02\x02\x02\x11\x10\x03" +
		"\x02\x02\x02\x12\x05\x03\x02\x02\x02\x13\x14\x07\v\x02\x02\x14\x15\x07" +
		"\x03\x02\x02\x15\x16\x05\b\x05\x02\x16\x07\x03\x02\x02\x02\x17\x18\b\x05" +
		"\x01\x02\x18!\x07\r\x02\x02\x19!\x07\v\x02\x02\x1A\x1B\x07\x04\x02\x02" +
		"\x1B\x1C\x05\b\x05\x02\x1C\x1D\x07\x05\x02\x02\x1D!\x03\x02\x02\x02\x1E" +
		"\x1F\x07\x06\x02\x02\x1F!\x05\b\x05\x06 \x17\x03\x02\x02\x02 \x19\x03" +
		"\x02\x02\x02 \x1A\x03\x02\x02\x02 \x1E\x03\x02\x02\x02!1\x03\x02\x02\x02" +
		"\"#\f\x04\x02\x02#$\t\x02\x02\x02$0\x05\b\x05\x05%&\f\x03\x02\x02&\'\t" +
		"\x03\x02\x02\'0\x05\b\x05\x04(+\f\x05\x02\x02)*\x07\x07\x02\x02*,\x05" +
		"\b\x05\x02+)\x03\x02\x02\x02,-\x03\x02\x02\x02-+\x03\x02\x02\x02-.\x03" +
		"\x02\x02\x02.0\x03\x02\x02\x02/\"\x03\x02\x02\x02/%\x03\x02\x02\x02/(" +
		"\x03\x02\x02\x0203\x03\x02\x02\x021/\x03\x02\x02\x0212\x03\x02\x02\x02" +
		"2\t\x03\x02\x02\x0231\x03\x02\x02\x02\b\r\x11 -/1";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!CalculatorParser.__ATN) {
			CalculatorParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(CalculatorParser._serializedATN));
		}

		return CalculatorParser.__ATN;
	}

}

export class ProgContext extends ParserRuleContext {
	public stat(): StatContext[];
	public stat(i: number): StatContext;
	public stat(i?: number): StatContext | StatContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatContext);
		} else {
			return this.getRuleContext(i, StatContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalculatorParser.RULE_prog; }
	// @Override
	public enterRule(listener: CalculatorListener): void {
		if (listener.enterProg) {
			listener.enterProg(this);
		}
	}
	// @Override
	public exitRule(listener: CalculatorListener): void {
		if (listener.exitProg) {
			listener.exitProg(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalculatorVisitor<Result>): Result {
		if (visitor.visitProg) {
			return visitor.visitProg(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatContext extends ParserRuleContext {
	public expr(): ExprContext | undefined {
		return this.tryGetRuleContext(0, ExprContext);
	}
	public assignment(): AssignmentContext | undefined {
		return this.tryGetRuleContext(0, AssignmentContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalculatorParser.RULE_stat; }
	// @Override
	public enterRule(listener: CalculatorListener): void {
		if (listener.enterStat) {
			listener.enterStat(this);
		}
	}
	// @Override
	public exitRule(listener: CalculatorListener): void {
		if (listener.exitStat) {
			listener.exitStat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalculatorVisitor<Result>): Result {
		if (visitor.visitStat) {
			return visitor.visitStat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssignmentContext extends ParserRuleContext {
	public ID(): TerminalNode { return this.getToken(CalculatorParser.ID, 0); }
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalculatorParser.RULE_assignment; }
	// @Override
	public enterRule(listener: CalculatorListener): void {
		if (listener.enterAssignment) {
			listener.enterAssignment(this);
		}
	}
	// @Override
	public exitRule(listener: CalculatorListener): void {
		if (listener.exitAssignment) {
			listener.exitAssignment(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalculatorVisitor<Result>): Result {
		if (visitor.visitAssignment) {
			return visitor.visitAssignment(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExprContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CalculatorParser.RULE_expr; }
	public copyFrom(ctx: ExprContext): void {
		super.copyFrom(ctx);
	}
}
export class NumberExprContext extends ExprContext {
	public Number(): TerminalNode { return this.getToken(CalculatorParser.Number, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CalculatorListener): void {
		if (listener.enterNumberExpr) {
			listener.enterNumberExpr(this);
		}
	}
	// @Override
	public exitRule(listener: CalculatorListener): void {
		if (listener.exitNumberExpr) {
			listener.exitNumberExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalculatorVisitor<Result>): Result {
		if (visitor.visitNumberExpr) {
			return visitor.visitNumberExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class VariableExprContext extends ExprContext {
	public ID(): TerminalNode { return this.getToken(CalculatorParser.ID, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CalculatorListener): void {
		if (listener.enterVariableExpr) {
			listener.enterVariableExpr(this);
		}
	}
	// @Override
	public exitRule(listener: CalculatorListener): void {
		if (listener.exitVariableExpr) {
			listener.exitVariableExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalculatorVisitor<Result>): Result {
		if (visitor.visitVariableExpr) {
			return visitor.visitVariableExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ParenExprContext extends ExprContext {
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CalculatorListener): void {
		if (listener.enterParenExpr) {
			listener.enterParenExpr(this);
		}
	}
	// @Override
	public exitRule(listener: CalculatorListener): void {
		if (listener.exitParenExpr) {
			listener.exitParenExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalculatorVisitor<Result>): Result {
		if (visitor.visitParenExpr) {
			return visitor.visitParenExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MinusExprContext extends ExprContext {
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CalculatorListener): void {
		if (listener.enterMinusExpr) {
			listener.enterMinusExpr(this);
		}
	}
	// @Override
	public exitRule(listener: CalculatorListener): void {
		if (listener.exitMinusExpr) {
			listener.exitMinusExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalculatorVisitor<Result>): Result {
		if (visitor.visitMinusExpr) {
			return visitor.visitMinusExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PowerExprContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CalculatorListener): void {
		if (listener.enterPowerExpr) {
			listener.enterPowerExpr(this);
		}
	}
	// @Override
	public exitRule(listener: CalculatorListener): void {
		if (listener.exitPowerExpr) {
			listener.exitPowerExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalculatorVisitor<Result>): Result {
		if (visitor.visitPowerExpr) {
			return visitor.visitPowerExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MulDivExprContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CalculatorListener): void {
		if (listener.enterMulDivExpr) {
			listener.enterMulDivExpr(this);
		}
	}
	// @Override
	public exitRule(listener: CalculatorListener): void {
		if (listener.exitMulDivExpr) {
			listener.exitMulDivExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalculatorVisitor<Result>): Result {
		if (visitor.visitMulDivExpr) {
			return visitor.visitMulDivExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AddSubExprContext extends ExprContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CalculatorListener): void {
		if (listener.enterAddSubExpr) {
			listener.enterAddSubExpr(this);
		}
	}
	// @Override
	public exitRule(listener: CalculatorListener): void {
		if (listener.exitAddSubExpr) {
			listener.exitAddSubExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CalculatorVisitor<Result>): Result {
		if (visitor.visitAddSubExpr) {
			return visitor.visitAddSubExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


