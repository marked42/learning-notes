// refer to https://www.w3.org/TR/CSS21/visuren.html#inline-boxes
interface PositionOptions {
  display: string,
  float: string,
  position: string,
}

function resolvePosition(options: PositionOptions) {
  const computedOptions = {...options}

  if (computedOptions.display === 'none') {
    return computedOptions
  }

  if (computedOptions.position === 'absolute' || computedOptions.position === 'fixed') {
    computedOptions.float = 'none'
    return computedOptions
  }

  const isRootElement = true

  const map = {
    'inline-table': 'table',
    'inline': 'block',
    'inline-block': 'block',
    // omitted some more maps
  }

  if (computedOptions.float !== 'none' || isRootElement) {
    if (map[computedOptions.display]) {
      computedOptions.display = map[computedOptions.display]
    }

    return computedOptions
  }
}
