export class MyersLinear {
  constructor(private a: string, private b: string) {}

  diff() {}

  findPath(left: number, top: number, right: number, bottom: number) {
    const box = new Box(left, top, right, bottom)

    const snake = this.middleSnake(box)

    if (!snake) {
      return null
    }

    const [start, finish] = snake

    const head = this.findPath(left, top, start[0], start[1])
    const tail = this.findPath(finish[0], finish[1], right, bottom)

    return (head || [start]).concat(tail || [finish])
  }

  middleSnake(box: Box) {
    if (box.size === 0) {
      return null
    }
    const max = Math.ceil(box.size / 2)
    const getV = (v: number[], k: number) => v[k + max]
    const setV = (v: number[], k: number, val: number) => (v[k + max] = val)

    const vf = new Array<number>(2 * max + 1)
    vf[1] = 0
    setV(vf, 1, 0)
    const vb = new Array<number>(2 * max + 1)
    setV(vb, 1, 0)

    for (let d = 0; d < max; d++) {
      const f = forward(box, vf, vb, d)
      if (f) {
        return f
      }
      const b = backward(box, vf, vb, d)
      if (b) {
        return b
      }
    }

    var forward = (box: Box, vf: number[], vb: number[], d: number) => {
      let px
      let x
      let y
      let py
      for (let k = -d; k <= d; k += 2) {
        const c = k - box.delta

        if (k === -d || (k !== d && getV(vf, k + 1) < getV(vf, k - 1))) {
          px = getV(vf, k + 1)
          x = px
        } else {
          px = getV(vf, k - 1)
          x = px + 1
        }

        y = box.top + (x - box.left) - k
        py = d === 0 || x !== px ? y : y - 1

        while (x < box.right && y < box.bottom && this.a[x] === this.b[y]) {
          x++
          y++
        }

        setV(vf, k, x)

        if (
          box.delta % 2 === 1 &&
          -(d - 1) <= c &&
          c <= d - 1 &&
          y >= getV(vb, c)
        ) {
          return [
            [px, py],
            [x, y],
          ]
        }
      }
    }

    var backward = (box: Box, vf: number[], vb: number[], d: number) => {
      let x, y, px, py
      for (let c = -d; c <= d; c += 2) {
        const k = c + box.delta

        if (c === -d || (c !== d && getV(vb, c - 1) > getV(vb, c + 1))) {
          py = y = getV(vb, c + 1)
        } else {
          py = getV(vb, c - 1)
          y = py - 1
        }

        x = box.left + (y - box.top) + k
        px = d === 0 || y != py ? x : x + 1

        while (x > box.left && y > box.right && this.a[x] === this.b[y]) {
          x--
          y--
        }

        setV(vb, c, y)

        if (box.delta % 2 === 0 && -d <= k && k <= d && x <= getV(vf, k)) {
          return [
            [px, py],
            [x, y],
          ]
        }
      }
    }
  }
}

class Box {
  constructor(
    public left: number,
    public top: number,
    public right: number,
    public bottom: number
  ) {}

  public get width() {
    return this.right - this.left
  }

  public get height() {
    return this.bottom - this.top
  }

  public get size() {
    return this.width + this.height
  }

  public get delta() {
    return this.width - this.height
  }
}
