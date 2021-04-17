function leftPad(str, length, paddingStr = ' ') {
  assertIsString(str)

  // 截断
  assertIsPositiveInteger(length);
  if (length <= str.length) {
    return str.substring(str.length - length, str.length)
  }

  assertIsString(paddingStr)
  const paddingLength = length - str.length

  let i = 0;
  for (; i < paddingLength - paddingStr.length; i += paddingStr.length) {
    str = paddingStr + str
  }
  if (i < paddingLength) {
    const remainingPaddingLength = paddingLength - i;
    const remainingPaddingStr = paddingStr.substring(paddingStr.length - remainingPaddingLength, paddingStr.length);
    str = remainingPaddingStr + str
  }

  return str
}

function assertIsPositiveInteger(value) {
  if (Number.isInteger(value) && value > 0) {
    return;
  }
  throw new Error(`value ${value} is not a positive integer`)
}

function assertIsString(value) {
  if (typeof value === 'string') {
    return;
  }

  throw new Error(`value ${value} is not string`)
}

const testCases = [
  [['12', 5, '0'], '00012'],
  [['12', 5, '0-'], '-0-12'],
  [['12', 1, '0-'], '2'],
];
testCases.forEach(testCase => {
  const [args, result] = testCase;
  console.log(`leftPad(${args}) === ${result}: ${leftPad.apply(null, args)}`);
})

// TODO: 居中、居右
