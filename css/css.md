# CSS

1. selector
   1. pseudo selectors: first-of-type, last-of-type, only-of-type, only-child, nth-child, :after, :before, :enabled, :disabled, :checked
1. display: block, none, inline, inline-block, list-item, table, inherit
1. cascading & inheritance
   1. inherite: font-size, font-family color, ul, li, dl, dd, dt
   1. non-inherite: border, padding, margin, width, height
   1. !important > id > class > tag
1. Layout
   1. box model
   1. margin collapsing
   1. positioning and floating
      1. static, relative, absolute, fixed(Old IE)
      1. 面试者知道使用 overflow:hidden 等来实现要求，但不知道原理。2.不仅知道，而且有创新，比如如果内部有内容需要溢出时改用 display:table-cell。有人说知道这些概念没啥用，我说如果你不仅知道这些概念，还能灵活的学以致用，那才是 CSS 之道。当然如果连 position 有几个属性值都不知道，只能是「负分，滚粗了」。
   1. flex layout
   1. grid layout
   1. table layout
   1. responsive design
      1. viewport
      1. media query
1. effects
1. transforms
1. transition
1. animation
1. SASS, LESS, BEM, OOCSS

## Elements

### Replaced and Nonreplaced Elements

Replaced elements are elements whose contents are replaced by something that is not directly represented by document. It has a intrinsic width and height.

Typical replated elements are:

- `<iframe>`
- `<embed>`
- `<video>`
- `<img>`
- `<input>`

Some elements are treated as replaced elements only in specific cases:

- `<audio>`
- `<canvas>`
- `<object>`
- `<applet>`

### Styles

#### External Styles

Stylesheet in a html document falls into following categories.

1. **Persistent** (no rel="alternate", no title="..."), always applied to document.
1. **Preferred** (no rel="alternate", with title="..."), applied by default, when there're multiple preferred stylesheets, only one of them will take effect, others will be ignored. However, HTML specification doesn't define rules for deciding which one to use.
1. **Alternate** (rel="stylesheet alternate", title="..."), disabled by default, activated when selected by user.

If any alternate stylesheet is selected by user, all preferred stylesheets are disabled.

Media property of `<link>` specifies preferred media for stylesheets, corresponding stylesheet takes effect when actual media fits value of media property.

```html
<link href="default.css" rel="stylesheet" title="Default">
<link href="basic.css" rel="alternate stylesheet" title="Basic">
<link href="fancy.css" rel="alternate stylesheet" title="Fancy">
```

`<link>` element has `onload` for handling `load` event and `onerror` for `error` event when loading external stylesheet.

```html
<script>
function sheetLoaded() {
  // Do something interesting; the sheet has been loaded
}

function sheetError() {
  console.log("An error occurred loading the stylesheet!");
}
</script>

<link rel="stylesheet" href="mystylesheet.css" onload="sheetLoaded()"
  onerror="sheetError()">
```

#### Embedded Styles

`<style>` tag is used to write CSS directly inside html document.

```html
<style type='text/css' media='print screen' nonce title='Default'>
@import url(http://example.org/library/layout.css);
@import url(basic-text.css);
@import url(printer.css) print;
body {color: red;}
h1 {color: blue;}
</style>
```

1. `type` attribute is optional and defaults to `text/css`.
1. `media` and `title` works like `<link>` element.

`@import` directive can be used inside css to include rules from external stylesheets.

1. It must be placed before other stylesheet rules, otherwise it will be ignored.
1. Relative or absolute urls can be used to refer to external stylesheet.
1. Media query can be used likely.

#### Inline Styles

Use `style` attribute of a html element to specify inline styles for correpsonding element.

```html
<p style="color: gray;">The most wonderful of all breakfast foods is
the waffle—a ridged and cratered slab of home-cooked, fluffy goodness...
</p>
```

Value of `style` attributes can be one or more specific rules. `@import` directive, selectors cannot be used.

## CSS Rule

![CSS Rule Structure](./css_rule_structure.png)

### Vendor prefixing

|Prefix|Vendor|
|--|--|
|-epub-| International Digital Publishing Forum ePub format|
|-moz-| Mozilla-based browsers(e.g. Firefox)|
|-ms-| Microsoft Internet Explorer|
|-o-| Opera-based browsers|
|-webkit-| Webkit-based browsers(e.g. Safari and Chrome)|

### Comments

CSS comments has only one format of `/* ... */`, it can span over multiple lines. No rest of the line comment like `//` in C++ or `#` in python.

```css
/* This is a CSS1 comment, and it
can be several lines long without
any problem whatsoever. */

h1 {color: gray;}  /* This CSS comment is several lines */
```

### [Media Query](https://www.w3.org/TR/mediaqueries-4/)

Media query can be used in following places.

1. `media` attribute of a `link` element.
1. `media` attribute of a `style` element.
1. media descriptor portion of an `@import` declaration.
1. media descriptor portion of an `@media` declaration.

#### Media types

1. `all` - Use in all presentational media.
1. `print` - Use for document printing or print preview
1. `screen` - Use when presenting document on a screen medium. All web browsers are screen medium.

#### Media Features

Media features expressions test for specific characteristics of user agent, output device or environment. They are optional and must be wrapped inside parenthesis if present.

#### Logical Operators

Logical operators `not`, `and`, `only` can be used to compose mutiple media queries into single one. Explicity media type must be supplied when using `not` and `only`.

```css
not (color) and (orientation: landscape) and (min-device-width: 800px)
```

`not` negates entire media query, so it's equivalent to

```css
not ((color) and (orientation: landscape) and (min-device-width: 800px))
```

`or` operator doesn't exist, use comma for equivalent function.

#### Comma Separated Lists

Mutiple media queries can be separated by comma. If any of those media queries fits, it will take effect.

### [Feature Query](https://drafts.csswg.org/css-conditional-3/#at-supports)

Feature query is used to detect if some features are supported by user agent. It's a perfect way of adapting to new features progressively.

Logical operators `not`, `and`, `or` can be used to compose multiple feature queries together. `not` negates entire feature query, use parenthesis to change applied range if needed.

```css
@supports not (text-align-last: justify) or (-moz-text-align-last: justify) {
}

/* same as above, but clearer with extra parenthesis */
@supports not ((text-align-last: justify) or (-moz-text-align-last: justify)) {
}

/* custom property */
@supports (--foo: green) {
  body {
    color: var(--varName);
  }
}
```

Use feature query with both name and value for accurate test, cause user agent may recgonize feature name but not specific value.

Feature query only means user agent recognizes target feature, but it's not guaranteed that user agent implement features correctly.

```css
@supports (display) {
    /* recognize display but not supporting grid property */
}

@supports (display: grid) {
    /* recognize display property with grid value */
}
```

## Selector

### link

Link related pseudo-class selectors `:link`, `:visited`, `:hover`, `:active` should be defined by the LVHA-order to make links work properly.

1. `:link` has the lowest priority and can be overwritten by other rules, it goes first.
1. `<a>` is expected to respond to hover after being visited, so `:hover` goes after `:visited`.
1. click on `<a>`, we expect `:active` to take effect and overwrite `:hover`, so `:active` goes after `:hover`.

## Box Model

Every element in html page is a rectangular box.

![Box Model](./box_model.png)

`box-sizing` is used to specify which box model is used.

1. `content-box` - default option, `width` property means content width.
   ```math
   width = content-width
   totalWidth = width + padding-left + padding-right + border-left + border-right
   ```
1. `padding-box` - `width` property means padding width and content width combined.
   ```math
   width = content-width + padding-left + padding-right
   totalWidth = width + padding-left + padding-right + border-left + border-right
   ```
1. `border-box` - `width` property means total width of content, padding and border.
   ```math
   width = content-width + padding-left + padding-right + border-left + border-right
   totalWidth = width
   ```

## Margin Collapsing

In a normal content flow, when multiple vertical margins are adjacent to each other. Multiple margins will collapse into a single one with its height equivalent to the maximum height of collapsed margins.

Typical cases for margin collapsing

1. Self Collapsing. When an element is empty, which means its height of content, padding and border are zero, its top margin and bottom margin will collapse into one margin.
1. Adjacent Collapsing. Bottom margin of element above and top margin of element below will collapse into one margin.
1. Parent Children Collapsing. When parent element top margin is adjacent to top margin of first child element, or parent element bottom margin is adjacent to bottom margin of last child element, margin collapsing will happen.

## [Normal Flow](https://www.w3.org/TR/CSS2/visuren.html#normal-flow)

## [`display`](https://developer.mozilla.org/en-US/docs/Web/CSS/display)

HTML specification says that inline elements cannot contain block elements like below.

```html
<span>inline<p>block</p></span>
```

But CSS has no such restrictions, inline and block elements can be nested in random order.

1. display-outside
1. display-inside
1. display-listitem
1. display-internal
1. display-box
1. display-legacy

## [Positioning](https://drafts.csswg.org/css-position-3/#position-property)

Positioning allows you to define

<table>
    <caption><h2>position</h2></caption>
    <tr>
        <td>Values</td>
        <td>static | relative | sticky | absolute | fixed </td>
    </tr>
    <tr>
        <td>initial value</td>
        <td>static</td>
    </tr>
    <tr>
        <td>Applies to</td>
        <td>All elements</td>
    </tr>
    <tr>
        <td>Computed Value</td>
        <td>As specified</td>
    </tr>
    <tr>
        <td>Inherited</td>
        <td>No</td>
    </tr>
    <tr>
        <td>Animatable</td>
        <td>No</td>
    </tr>
</table>

Containing block and initial containing block.

1. static - element is not positioned, use position in normal flow.
1. fixed - element is positioned relative to viewport of browser window.

Width and height of replaced elements can be shrinked or expanded to fit if set to auto, nonreplaced elements has an intrinsic width and height, so it cannot be shrinked or expanded.

```math
totalWidth = left + right + margin-left + margin-right + border-width-left + border-width-right + padding-left + padding-right + width
```

If horizontal width is overconstrained, left takes over right for left-to-right language, right is computed as remainder value to solve the equation, right takes over left for right-to-left language, left is computed as remainder value to solve the equation.

<table>
    <caption><h2>position</h2></caption>
    <tr>
        <th align='left'>property</th>
        <th align='left'>default</th>
        <th align='left'>auto behaviour</th>
    </tr>
    <tr>
        <td>top</td>
        <td>auto</td>
        <td>lowest priority, computed as remainder value to solve equation, assume static position</td>
    </tr>
    <tr>
        <td>bottom</td>
        <td>auto</td>
        <td>lowest priority, computed as remainder value to solve equation</td>
    </tr>
    <tr>
        <td>margin-top<br>margin-bottom</td>
        <td>0</td>
        <td>when either is auto, takes remainder value, when both is auto, split remainder value equally.</td>
    </tr>
    <tr>
        <td>border-width-top<br>border-width-bottom</td>
        <td>auto</td>
        <td></td>
    </tr>
    <tr>
        <td>padding-top<br>padding-bottom</td>
        <td>0</td>
        <td></td>
    </tr>
    <tr>
        <td>width</td>
        <td>auto</td>
        <td>for replaced element, auto takes intrinsic height, for nonreplaced element, auto takes remainder or shrink to fit.</td>
    </tr>
</table>

### Nonreplaced Elements

In horizontal layout, either **right** or **left** can be placed according to the static position if their values are **auto**. In vertical layout, only **top** can take on the static position.

Also, if an absolutely positioned element's size is overconstrained in the vertical direction, **bottom** is ignored.

### Positioned Element

_positioned_ element is an element with poisiton value of `fixed`, `absolute`, `relative` or `sticky`.

### Containing Block

1. **static/relative** - containing block is formed by the edge of the content box of nearest ancestor element that is a block container (inline-block, block, list-item) or which establishes a formatting context (table container, flex container, grid container, or the block container)
1. **absolute** - containing block is formed by the edge of the _padding box_ of the nearest _positioned_ ancestor element.
1. **fixed** - containing block is established by the viewport (in the case of continous media) or the page area (in the case of paged media).
1. **absolute/fixed** - the containing block may also be formed by the edge of the padding box of the nearest ancestor element that has the following:
   1. A transform or perspective value other than none
   1. A will-change value of transform or perspective
   1. A filter value other than none or a will-change value of filter (only works on Firefox).

For a non-root element that has a position value of absolute, its containing block is
set to the nearest ancestor (of any kind) that has a position value other than static. This happens as follows:

1. If the ancestor is block-level, the containing block is set to be that element’s pad‐ ding edge; in other words, the area that would be bounded by a border.
1. If the ancestor is inline-level, the containing block is set to the content edge of the ancestor. In left-to-right languages, the top and left of the containing block are the top and left content edges of the first box in the ancestor, and the bottom and right edges are the bottom and right content edges of the last box. In right-to-left languages, the right edge of the containing block corresponds to the right content edge of the first box, and the left is taken from the last box. The top and bottom are the same.
1. If there are no ancestors, then the element’s containing block is defined to be the

**Initial containing block** refers to the rectangle that root element `<html>` resides. It has the dimensions of the viewport (for continuous media) or the page area (for paged media)

### Offset Property

Positioning allows you to define

<table>
    <caption><h2>top,right,bottom,left</h2></caption>
    <tr>
        <td>Values</td>
        <td>&lt;length&gt; | &lt;percent&gt; | auto</td>
    </tr>
    <tr>
        <td>initial value</td>
        <td>auto</td>
    </tr>
    <tr>
        <td>Applies to</td>
        <td>Positioned elements</td>
    </tr>
    <tr>Refer to the height of containing block for top and bottom, and the width of containing block for right and left</tr>
    <tr>
        <td>Computed Value</td>
        <td>For static elemens, auto; for length values, the corresponding absolute length; for percentage values, the specified value; otherwise, auto./td>
    </tr>
    <tr>
        <td>Inherited</td>
        <td>No</td>
    </tr>
    <tr>
        <td>Animatable</td>
        <td>&lt;length&gt;, &lt;percentage&gt;</td>
    </tr>
</table>

## Formatting Context

## Dispaly
