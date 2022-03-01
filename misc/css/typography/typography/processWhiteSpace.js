import {
  transformSegmentBreaks,
} from './segmentBreak'

// ignore bidi control characters
function collapseWhiteSpaces(text, whiteSpacesCollapsible) {
  if (!whiteSpacesCollapsible) {
    return text
  }

  // remove spaces and tabs immediately preceding or following a segment break
  text = removeSegmentBreakAdjacentWhiteSpaces(text)

  text = transformSegmentBreaks(text)

  text = replaceTabWithSpace(text)

  text = collapseConsecutiveWhiteSpaces(text)
}

export function removeSegmentBreakAdjacentWhiteSpaces(text) {
  return text
}

export function replaceTabWithSpace(text) {
  return text
}

export function collapseConsecutiveWhiteSpaces(text) {
  return text
}

export function processWhiteSpace(text, whiteSpacesCollapsible) {
  text = collapseWhiteSpaces(text)

  laidOutTextToLines(text, whiteSpacesCollapsible)

  return text
}

export function laidOutTextToLines(text, whiteSpacesCollapsible) {
  if (whiteSpacesCollapsible) {
    text = text.trimLeft()
  }

  text = expandTabs(text)

  if (whiteSpacesCollapsible) {
    text = text.trimRight()
  }

  return text
}

export function expandTabs(text) {
  return text
}
