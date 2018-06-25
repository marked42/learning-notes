interface CssDeclarations {
  left: string,
  right: string,
  top: string,
  bottom: string,
  direction: string,
  position: 'relative',
}

// refer to https://www.w3.org/TR/CSS21/visuren.html#relative-positioning
function resolveRelativePositioning(options: CssDeclarations) {
  const computedOptions = { ...options }

  if (computedOptions.left === 'auto' && computedOptions.right === 'auto') {
    computedOptions.left = '0'
    computedOptions.right = '0'
  } else if (computedOptions.left === 'auto') {
    computedOptions.left = `-${computedOptions.right}`
  } else if (computedOptions.right === 'auto') {
    computedOptions.right = `-${computedOptions.left}`
  } else if (options.direction === 'ltr') {
    computedOptions.right = `-${options.left}`
  } else if (options.direction === 'rtl') {
    computedOptions.left === `-${options.right}`
  }

  if (computedOptions.top === 'auto' && computedOptions.bottom === 'auto') {
    computedOptions.top = '0'
    computedOptions.bottom = '0'
  } else if (computedOptions.top === 'auto') {
    computedOptions.top = `-${computedOptions.bottom}`
  } else if (computedOptions.bottom === 'auto') {
    computedOptions.bottom = `-${computedOptions.top}`
  } else {
    computedOptions.bottom = `-${options.top}`
  }
}
