interface Element {
  display: string,
  replaced: boolean,
  boxes: ElementBoxCollection,
}

interface ElementBoxCollection {
  principal: ElementBox,
  all: ElementBox[],
}

interface ListItemElementBoxCollection extends ElementBoxCollection {
  marker: ElementBox,
}

interface AnonymousBox {
  text: string,
}

interface ElementBox {
  element: Element,
}

const DisplayOption = {
  block: 'block',
  listItem: 'list-item',
  table: 'table',
  inline: 'inline',
  inlineBlock: 'inline-block',
  inlineTable: 'inline-table',
  tableCell: 'table-cell',
}

function isBlockLevelBox(box: ElementBox) {
  const blockOptions = [
    DisplayOption.block,
    DisplayOption.listItem,
    DisplayOption.table,
  ]

  return blockOptions.includes(box.element.display)
}

function isBlockBox(box: ElementBox) {
  const blockBoxOptions = [
    DisplayOption.block,
    DisplayOption.listItem,
  ]

  return  blockBoxOptions.includes(box.element.display) && !box.element.replaced
}

function isInlineLevelBox(box: ElementBox) {
  const inlineOptions = [
    DisplayOption.inline,
    DisplayOption.inlineBlock,
    DisplayOption.inlineTable,
  ]

  return inlineOptions.includes(box.element.display)
}

function isInlineBox(box: ElementBox) {
  return box.element.display === DisplayOption.inline && !box.element.replaced
}

function isAtomicInlineLevelBox(box: ElementBox) {
  return isInlineLevelBox(box) && !isInlineBox(box)
}

function isBlockContainerBox(box: ElementBox) {
  return isBlockBox(box) && isInlineBlockContainerBox(box)
}

function isInlineBlockContainerBox(box: ElementBox) {
  const element = box.element

  const inlineBlockContainerDisplayOptions = [
    DisplayOption.inlineBlock,
    DisplayOption.tableCell,
  ]

  return inlineBlockContainerDisplayOptions.includes(element.display) && !element.replaced
}
