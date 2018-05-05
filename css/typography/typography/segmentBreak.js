import {
  isSegmentBreak,
  isZeroWidthSpace,
  eastAsianWidthIsFHW,
  isHangul,
  isEmoji,
  removeCharAt,
  contentLanguageIsCJY,
  collapseConsecutiveSegmentBreaks,
} from './common'

// https://drafts.csswg.org/css-text-3/#line-break-transform
export function transformSegmentBreaks(text, segmentBreaksCollapsible) {
  if (!segmentBreaksCollapsible) {
    return replaceSegmentBreakWithLineFeed(text)
  }

  text = collapseConsecutiveSegmentBreaks(text)

  // notice code length represents UTF-16 code unit length
  let i = 0
  while (i < text.length) {
    if (!isSegmentBreak(text[i])) {
      i++
      continue
    }

    const prev = text[i - 1]
    const next = text[i + 1]

    const zeroWidthSpacePass = (prev && isZeroWidthSpace(prev)) || (next && isZeroWidthSpace(next))

    const eastAsianWidthPass = (prev && eastAsianWidthIsFHW(prev) && !isHangul(prev) && !isEmoji(prev)) &&
      (next && eastAsianWidthIsFHW(next) && !isHangul(next) && !isEmoji(next))

    //
    const contentLanguagePass = contentLanguageIsCJY() && true

    // remove if any condition passes
    if (zeroWidthSpacePass || eastAsianWidthPass || contentLanguagePass) {
      text = removeCharAt(i)
      continue
    }

    // otherwise replace with space
    text[i] = ' '
    i++
  }

  return text
}

export function replaceSegmentBreakWithLineFeed(text) {
  for (let i = 0; i < text.length; i++) {
    if (isSegmentBreak(text[i])) {
      text[i] = '\n'
    }
  }

  return text
}
