# Constraint Based Layout

1. [Widget Tree](https://book.huihoo.com/debian-gnu-linux-desktop-survival-guide/Widget_Tree.html)
2. [Boxes and Glue: A Brief, but Visual, Introduction Using LuaTeX](https://www.overleaf.com/learn/latex/Articles/Boxes_and_Glue%3A_A_Brief%2C_but_Visual%2C_Introduction_Using_LuaTeX)
3. [Understanding Auto Layout](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/index.html)
4. Android Layout ?
5. QT Layout ?

## RenderTree

1. timing of triggering layout, needsLayout
   1. add child
   1. change size (prevent ), propagates to parent / sibling / children ?
   1. avoid unnecessary layout
1. timing of triggering paint, needsPaint
   1. layout triggers needsPaint
   1. change style (color)
   1. avoid unnecessary paint
1. devicePixelRatio

1. [Let's build a render tree](https://www.youtube.com/watch?v=VsYbFnucHsU)
1. [Hit Testing and Events](https://www.youtube.com/watch?v=EXSImr8agnA)
1. [Rasterization](https://www.youtube.com/watch?v=vulHeWlEiQc)
