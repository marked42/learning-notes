# Javascript

parsers & engines

1. v8
1. babel/[babylon](https://github.com/babel/babylon)
1. typescript
1. esprima
1. acorn/[acorn-jsx](https://github.com/acornjs/acorn-jsx)
1. eslint
1. prettier
1. https://github.com/v8/v8/blob/6.4.286/src/parsing/scanner.cc

1. https://github.com/mozilla/narcissus/

Spec

1. https://fed.taobao.org/blog/taofed/do71ct/mlgtox/?spm=taofed.blogs.blog-list.1.2beb5ac8IEtTG3
1. https://timothygu.me/es-howto/?spm=taofed.bloginfo.blog.35.2c2e5ac8DuBYAN
1. https://v8.dev/blog/tags/understanding-ecmascript

## AST 设计

[Esprima](https://docs.esprima.org/en/latest/syntax-tree-format.html) 使用 [ESTree specification](https://github.com/estree/estree)

考虑四个点

1. Backward compatible
1. Contextless
1. Unique
1. Extensible

[Babel](https://babeljs.io/docs/en/babel-parser#output)使用 [Babel AST format](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md)，基于 ESTree Spec 做了一些修改

## JSX 语法

[JSX AST](https://github.com/facebook/jsx)

##

1. [A Prettier Formatter](https://archive.jlongster.com/A-Prettier-Formatter)
1. [a prettier printer](https://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf)
1. [Javascript Hidden Classes and Inline Caching in V8](http://richardartoul.github.io/jekyll/update/2015/04/26/hidden-classes.html)

1. [The Essence of Javascript](https://blog.brownplt.org/2011/09/29/js-essence.html)

1. [Javascript Mozilla](https://hacks.mozilla.org/category/javascript/)
1. [SpiderMonkey](https://hacks.mozilla.org/2020/06/compiler-compiler-working-on-a-javascript-engine/)
1. [A New Regexp Engine in SpiderMonkey](https://hacks.mozilla.org/2020/06/a-new-regexp-engine-in-spidermonkey/)

Javascript 规范解读 ES5 之前

1.  articles
    1.  [JavaScript 是如何工作的：JavaScript 的内存模型](https://zhuanlan.zhihu.com/p/62449359)
    1.  [JavaScript. The Core: 2nd Edition](http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/)
    1.  [ECMA-262-5 in detail. Chapter 0. Introduction](http://dmitrysoshnikov.com/ecmascript/es5-chapter-0-introduction/)
    1.  [ECMA-262-5 in detail. Chapter 1. Properties and Property Descriptors.](http://dmitrysoshnikov.com/ecmascript/es5-chapter-1-properties-and-property-descriptors/)
    1.  [ECMA-262-5 in detail. Chapter 2. Strict Mode.](http://dmitrysoshnikov.com/ecmascript/es5-chapter-2-strict-mode/)
    1.  [ECMA-262-5 in detail. Chapter 3.1. Lexical environments: Common Theory](http://dmitrysoshnikov.com/ecmascript/es5-chapter-3-1-lexical-environments-common-theory/#rules-of-function-creation-and-application)
    1.  [ECMA-262-5 in detail. Chapter 3.2. Lexical environments: ECMAScript implementation.](http://dmitrysoshnikov.com/ecmascript/es5-chapter-3-2-lexical-environments-ecmascript-implementation/#identifier-resolution)
    1.  [ECMA-262-3 in detail. Chapter 1. Execution Contexts](http://dmitrysoshnikov.com/ecmascript/chapter-1-execution-contexts/)
    1.  [ECMA-262-3 in detail. Chapter 2. Variable object](http://dmitrysoshnikov.com/ecmascript/chapter-2-variable-object/)
    1.  [ECMA-262-3 in detail. Chapter 3. This](http://dmitrysoshnikov.com/ecmascript/chapter-3-this/)
    1.  [ECMA-262-3 in detail. Chapter 4. Scope chain](http://dmitrysoshnikov.com/ecmascript/chapter-4-scope-chain/)
    1.  [ECMA-262-3 in detail. Chapter 5. Functions.](http://dmitrysoshnikov.com/ecmascript/chapter-5-functions/)
    1.  [ECMA-262-3 in detail. Chapter 6. Closures.](http://dmitrysoshnikov.com/ecmascript/chapter-6-closures/)
    1.  [ECMA-262-3 in detail. Chapter 7.1. OOP: The general theory](http://dmitrysoshnikov.com/ecmascript/chapter-7-1-oop-general-theory/)
    1.  [ECMA-262-3 in detail. Chapter 7.2. OOP: ECMAScript implementation.](http://dmitrysoshnikov.com/ecmascript/chapter-7-2-oop-ecmascript-implementation/)
    1.  [ECMA-262-3 in detail. Chapter 8. Evaluation strategy](http://dmitrysoshnikov.com/ecmascript/chapter-8-evaluation-strategy/)
    1.  [The Quiz](http://dmitrysoshnikov.com/ecmascript/the-quiz/)
    1.  [OO Relationships](https://medium.com/@DmitrySoshnikov/oo-relationships-5020163ab162)
    1.  [Note 6. ES6: Default values of parameters](http://dmitrysoshnikov.com/ecmascript/es6-notes-default-values-of-parameters/)
    1.  [JavaScript Array “Extras” in Detail](https://dev.opera.com/articles/javascript-array-extras-in-detail/)
    1.  [Javascript Closures](http://jibbering.com/faq/notes/closures/)
