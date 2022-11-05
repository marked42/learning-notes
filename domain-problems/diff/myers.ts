class MyersDiff {
  cache = [] as number[][]
  d = 0

  constructor(private a: string, private b: string) {
    console.log(this.shortestEdit())
  }

  get max() {
    return this.a.length + this.b.length
  }

  getV(v: number[], k: number) {
    return v[k + this.max]
  }

  setV(v: number[], k: number, val: number) {
    v[k + this.max] = val
  }

  shortestEdit() {
    const m = this.a.length
    const n = this.b.length
    const max = m + n

    const v = new Array(2 * max + 1) as number[]

    // 初始化条件
    this.setV(v, 1, 0)
    for (let d = 0; d <= max; d++) {
      for (let k = -d; k <= d; k += 2) {
        if (
          k === -d ||
          (k !== d && this.getV(v, k - 1) < this.getV(v, k + 1))
        ) {
          this.setV(v, k, this.getV(v, k + 1))
        } else {
          //   set(k, get(k - 1) + 1)
          this.setV(v, k, this.getV(v, k - 1) + 1)
        }
        let x = this.getV(v, k)
        while (x < m && x - k < n && this.a[x] === this.b[x - k]) {
          x++
        }
        this.setV(v, k, x)
        // v[k] = x
        // const  k = x - y

        if (x == m && x - k == n) {
          this.d = d
          this.cache.push([...v])
          return d
        }
      }

      this.cache.push([...v])
    }
  }

  backtrack() {
    const m = this.a.length
    const n = this.b.length
    let k = m - n

    const d = this.d
    const points = [{ x: m, y: n }]
    for (let i = d; i > 0; i--) {
      const v = this.cache[i]

      let prevK = 0
      if (k === -d || (k !== d && this.getV(v, k - 1) < this.getV(v, k + 1))) {
        prevK = k + 1
      } else {
        prevK = k - 1
      }

      const prevX = this.getV(v, prevK)
      const prevY = prevX - prevK

      points.unshift({ x: prevX, y: prevY })

      k = prevK
    }

    return points
  }
}

const myersDiff = new MyersDiff('ABCABBA', 'CBABAC')
console.log(myersDiff.backtrack())
