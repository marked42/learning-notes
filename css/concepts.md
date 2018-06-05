# Concepts

1. containing block
1. initial containing block
1. content height/content width/content area/margin area
1. line box/block level elements/block boxes/block formatting context

block-level elements

```css
.block-level-elements {
  display: block;
  display: list-item;
  display: table;
}
```

**block level elements** generate block-level boxes

1. a principle block-level box (all)
1. additional block-level box (`display: list-item` only, marker box)

**block-level box** are laid out vertically, each box occupies one line.

1. table box
1. replaced element block-level box

**block box** (intersection of block-level box and block container box)

A **block container box** either establishes a block formatting context and thus contains only contains block boxes inside it, or establishes an inline formatting context and thus contains only inline boxes inside it.

1. non-replaced inline box
1. non-replaced table cells

If a block container box has block-level box inside it, then anonymous block-level boxes are created to contain text content to ensure that block container box only contains block-level boxes.

Inline-level elements

```css
.inline-level-elements {
  display: inline;
  display: inline-block;
  display: inline-table;
}
```
