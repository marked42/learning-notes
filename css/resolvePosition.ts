// refer to https://www.w3.org/TR/CSS21/visuren.html#inline-boxes
interface PositionOptions {
  display: string,
  float: string,
  position: string,
}

function resolvePosition(position) {
  const positionMap = {
    'inline-table': 'table',
    'inline': 'block',
    'table-row-group': 'block',
    'table-column': 'block',
    'table-column-group': 'block',
    'table-header-group': 'block',
    'table-footer-group': 'block',
    'table-row': 'block',
    'table-cell': 'block',
    'table-caption': 'block',
    'inline-block': 'block',
  }

  return positionMap[position] || position
}

function resolveLayout(options: PositionOptions, isRootElement: boolean = true) {
  const computedOptions = {...options}

  if (computedOptions.display === 'none') {
    return computedOptions
  }

  if (computedOptions.position === 'absolute' || computedOptions.position === 'fixed') {
    computedOptions.float = 'none'
    computedOptions.position = resolvePosition(computedOptions.position)
    return computedOptions
  }

  // undefined whether 'list-item' computed to 'block' or 'list-item' for root element in CSS 2.1
  if (computedOptions.float !== 'none' || isRootElement) {
    computedOptions.position = resolvePosition(computedOptions.position)
    return computedOptions
  }

  return computedOptions
}
