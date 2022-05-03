# 性能

1. [Jake Archibald & Surma - Setting up a static render in 30 minutes](https://www.youtube.com/watch?v=TsTt7Tja30Q)

1. [JS 性能](https://www.zhihu.com/question/402807137/answer/1322391162)
1. [Maybe you don't need Rust and WASM to speed up your JS](https://mrale.ph/blog/2018/02/03/maybe-you-dont-need-rust-to-speed-up-your-js.html)

### Web Workers

Share data between workers

| Method                                                          | Cost                                               |
| --------------------------------------------------------------- | -------------------------------------------------- |
| Serialize data to string and deserialize it back another worker | serialization cost and double memory for same data |
| Structured Cloning Algorithm                                    | double memory for same data                        |
| Transferable Objects                                            | none                                               |

SharedWorker

### **S**ingle **I**nstruction **M**ultiple **D**ata

[SIMD](https://01.org/node/1495) and [polyfill](https://github.com/johnmccutchan/ecmascript_simd)

```javascript
var v1 = SIMD.float32x4(3.14159, 21.0, 32.3, 55.55)
var v2 = SIMD.float32x4(2.1, 3.2, 4.3, 5.4)
var v3 = SIMD.int32x4(10, 101, 1001, 10001)
var v4 = SIMD.int32x4(10, 20, 30, 40)
SIMD.float32x4.mul(v1, v2) // [ 6.597339, 67.2, 138.89, 299.97 ]
SIMD.int32x4.add(v3, v4) // [ 20, 121, 1031, 10041 ]
```

### asm.js

Use special style of code to specify variable types and avoid performance penalty involving type coercions. Refer to [http://asmjs.org/](http://asmjs.org/).

asm.js is often a target for cross-compilation from other highly optimized program languages -- for example, [Emscripten](https://kripken.github.io/emscripten-site/) transpiling C/C++ to javascript.

```javascript
var a = 42
var b = a | 0 // this indicates b is always an integer
```

### Benchmark.js

Donald Knuth

> Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%.

YDKJS

> Non-critical path optimization is the root of all evil. No amount of time spent optimizing critical paths is wasted, no matter how little is saved; but no amount of optimization on noncritical pathhs is justified, no matter how much is saved.
