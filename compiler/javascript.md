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
