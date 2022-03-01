# Typography

## White Space, Line Break, Word Break

### white-space

It applies to all elements and is inherited by default. It instructs browser how to handle white spaces in side element text content.

1. whether white spaces should be collapsed ?
1. whether text should wrap to next line when there's no enough space ?

Answer combination of these two questions corresponds to four possible keyword value.

| keyword | white spaces | text wrap |
|:-|:-|:-|
|normal|collapse|wrap|
|nowrap|collapse|no wrap|
|pre-wrap|preserve|wrap|
|pre|preserve|no wrap|

Notice the contradicted naming between `normal` and `pre`, guess that is because normally we want to both collapse spaces and wrap text, but when users decide to preserve spaces, it's more often that they also don't want to wrap text. So the naming is not like `pre` and `pre-nowrap`.

And there's one more keyword value `pre-line`, it's almost same `pre-wrap` except that it preserves new line only and collapse spaces and tabs.

`nowrap` is often used to keep **text content** or **child inline elements** from wrapping to next line.

![white-space](./white-space.jpg)

Reference

[White Space and Wrapping: the white-space property](https://drafts.csswg.org/css-text-3/#propdef-white-space)

### text-overflow

`text-overflow` decides how overflowed content is displayed to user. It doesn't force overflow to occur, so you've to use with other two properties to force overflow and thus making `text-overflow` to take effect.

```css
white-space nowrap
overflow hidden
```

Some times you've to specify element width so that overflow can happen.

> The text-overflow property only affects content that is overflowing a block container element in its inline progression direction (not text overflowing at the bottom of a box, for example).

Formal syntax is like this.

```
[ clip | ellipsis | <string> ]{1,2}
```

Usually, we use only one keyword value. `clip` clips overflow content at parent block element's content area edge. `ellipsis` displays HONRIZONTAL ELLIPSIS (U+2026) to represent clipped text.

Reference

[text-overflow MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow)

When inline-level content is broken across multiple line boxes, it's called line break.
1. forced line break - due to explicit line break control characters or due to start of end of block
1. soft wrap break - due to content wrapping, browser create unforced line break to fit content into block

Wrapping happens only at allowed break point called **soft wrap opportunity**.

**Document white space** refers to characters inside html content that are considered as white spaces. It includes **white space** and **segment breaks**.
white spaces

1. space U+0020
1. tab U+0009
1. segment breaks
  1. line feed U+000A
  1. document language-defined segment breaks


1. zero width space (U+200B)
1. form feed U+000C
1. carriage return U+000D

Soft wrap opportunity

1. word boundary by explicit spaces and punctuation
1. hyphenation in language like english
1. orthographic syllable boundaries in CJK, allow line to break anywhere except certain character combinations.
1. lexical resource analysis when there's no explicit control character specifying line break


white space processing

White space that was not removed or collapsed during the white space processing steps is called **preserved** white space.

Reference

1. [UNICODE](https://www.unicode.org/reports/tr14/tr14-39.html)

### word break

`word-break` is used control how a word should be broken when wrapping to next line. Normally, any adjacent CJK characters can be broken, there's no word (consecutive characters) that should be broken inside normally. But for non-CJK languages, a word of consecutive characters is basic element of a sentence. Word should not be broken normally, and a 'hyphen' is often use indicate break inside word.

Possible keyword values for `word-break`.

1. `normal` - default behavior described above.
1. `break-all` - when a word overflows, break it to wrap to next line.
1. `keep-all` - do not allow word break, if a word overflows, let it be, then place next word at start of next line.
1. `break-word` - see `overflow-wrap`

Notice that `break-all` breaks non CJK words only, example below don't break under it.

```
// keep-all
----------------------------------
一段非常长长长长长长长长长长长长！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
----------------------------------

// normal/break-all
----------------------------------
一段非常长长长长长长长长长长长
长！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
----------------------------------

// word-break: break-word or overflow: break-word
----------------------------------
一段非常长长长长长长长长长长长
长！！！！！！！！！！！！！！！！！！！
！！！！！！！！！！！！！！！
----------------------------------
```

This long

`word-wrap` is an ms only css property and it's standardized as `overflow-wrap`,

1. `normal` - word cannot be broken
1. `break-word` - when there's no acceptable line break point, break a word at needed position to prevent overflow.

Notice that in MDN doc, `word-break` has a keyword value `break-word` which has same meaning like `overflow-wrap: break-word` , but it's not a standard value described as in [CSS Text Module Level 3](https://drafts.csswg.org/css-text-3/#propdef-word-break). However, this keyword value is supported in Chrome and Firefox.
