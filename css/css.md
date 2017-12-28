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
        1. 面试者知道使用 overflow:hidden 等来实现要求，但不知道原理。2.不仅知道，而且有创新，比如如果内部有内容需要溢出时改用display:table-cell。有人说知道这些概念没啥用，我说如果你不仅知道这些概念，还能灵活的学以致用，那才是CSS之道。当然如果连 position 有几个属性值都不知道，只能是「负分，滚粗了」。
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

## Positioning

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

1. fixed - element is positined relative to viewport of browser window.
1.

## Formatting Context

## Dispaly