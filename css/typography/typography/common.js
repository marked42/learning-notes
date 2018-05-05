export function isSegmentBreak(char) {
  return true
}

export function isWhiteSpace(char) {
  return true
}

export function isZeroWidthSpace(char) {
  return true
}

export function isTab(char) {
  return true
}

export function removeCharAt(string, start, end = start + 1) {
  return string.substring(0, start) + string.substring(end)
}

export const eastAsianWidth = {
  F: 'F',
  H: 'H',
  W: 'W',
  A: 'A',
}

export function getEastAsianWidth(char) {
  return eastAsianWidth.F
}

export function eastAsianWidthIsFHW(char) {
  const charPropertyValue = getEastAsianWidth(char)
  return charPropertyValue === eastAsianWidth.F ||
    charPropertyValue === eastAsianWidth.H ||
    charPropertyValue === eastAsianWidth.W
}

export function eastAsianWidthIsA(char) {
  return getEastAsianWidth(char) === eastAsianWidth.A
}

export function isHangul(char) {
  return true
}

export function isEmoji(char) {
  return true
}

export function isPunctuation(char) {
  return true
}

export function isSymbol(char) {
  return true
}

const languages = {
  Chinese: 0,
  Japanese: 1,
  Yi: 2,
}

export function getContentLanguage() {
  return languages.Chinese
}

export function contentLanguageIsCJY() {
  const lang = getContentLanguage()
  return lang === languages.Chinese ||
    lang === languages.Japanese ||
    lang === languages.Yi
}

export function collapseConsecutiveCharacters(text, predicate) {
  let i = 0

  while (i < text.length) {
    if (!predicate(text[i])) {
      i++
      continue
    }

    let j = i + 1
    while (j < text.length && predicate(text[j])) {
      j++
    }

    text = removeCharAt(text, i + 1, j)

    i = j + 1
  }
}

const createCollapseConsecutiveCharacters = predicate => text => collapseConsecutiveCharacters(text, predicate)

export const collapseConsecutiveSegmentBreaks = createCollapseConsecutiveCharacters(isSegmentBreak)

export const collapseConsecutiveWhiteSpaces = createCollapseConsecutiveCharacters(isWhiteSpace)
