interface CssDeclarations {
  left: string,
  right: string,
  top: string,
  bottom: string,
  direction: string,
  position: 'relative',
}

function resolveRelativePositioning(options: CssDeclarations) {
  const computedOptions = { ...options }

  if (computedOptions.left === 'auto' && computedOptions.right === 'auto') {
    computedOptions.left = '0'
    computedOptions.right = '0'
  } else if (computedOptions.left === 'auto') {
    computedOptions.right = `-${computedOptions.left}`
  } else if (computedOptions.right === 'auto') {
    computedOptions.left = `-${computedOptions.right}`
  } else if (options.direction === 'ltr') {
    computedOptions.right = 'ignored'
  } else if (options.direction === 'rtl') {
    computedOptions.left === 'ignored'
  }
}
