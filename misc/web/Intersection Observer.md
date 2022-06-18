# Intersection Observer

传统上有两种方法检测某一元素的位置

1. 使用定时器周期性调用`getBoundingClientRect()`
2. 监听用`scroll`事件调用`getBoundingClientRect()`进行位置检测

`scroll`事件触发频繁，需要对回调函数自行限流，同时`getBoundingClientRect()`会触发浏览器重新布局(re-layout)造成页面卡顿。

Intersection Observer可以检测元素在其某一父元素内部的相对位置状态，其回调函数是异步执行，优先级比较低，规范规定其回调函数必须使用`requestIdleCallback`的方式实现。

```ts
interface IntersectionObserverEntry {
  time: DOMHighResTimeStamp;
  rootBounds?: DOMRectReadOnly;     // 检测元素的矩形范围
  boundingClientRect?: DOMRectReadOnly; // 被检测元素的矩形范围
  intersectionRect?: DOMRectReadOnly; // 交叉矩形范围
  isIntersecting: boolean, // true表示现在显示的比例大于等于threshold, false表示显示的比列小于等于threshold,表示交叉变化的方向
  intersectionRatio: number; // 被检测元素可见部分相对于元素本身的比例，0完全不可见, 100%完全可见
  target: Element, // 被检测元素
}

type IntersectionObserverCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;

interface IntersectionObserverInit {
  root?: Element; // 进行交叉检测的父元素，值为null是默认为viewport
  rootMargin: DOMString = "0px"; // 类似css margin的值，用来扩大活缩小检测矩形范围
  threshold: number[] | number = 0; // 每个数字表示的比例触发一次entry
}

interface IntersectionObserver {
  constructor(callback: IntersectionObserverCallback, options: );

  readonly root?: Element;
  readonly rootMargin: DOMString;
  readonly thresholds: number[];

  observe: (target: Element) => void;
  unobserve: (target: Element) => void;
  diconnect: () => void;
  takeRecords: () => IntersectionObserverEntry[];
}

const observer = new IntersectionObserver(callback, options)

// 分别观察两个元素
observer.observe(element1)
observer.observe(element2)

// 停止观察element1
observer.unobserve(element1)

// 断开整个observer
observer.disconnect()
```

## sticky状态检测

应用了`sticky`布局的导航栏元素，一般希望能够在元素进入到固定位置时能够应用不同的样式，使用`IntersectionObserver`可以检测这种状态。

## 图片懒加载

```html
<!DOCTYPE html>

<html>
  <body>
    <img class="js-lazy-image" data-src="burger.png">

    <script>
      const images = document.querySelectorAll('.js-lazy-image');
      const config = {
        rootMargin: '50px 0px',
        threshold: 0.01,
      };

      function preloadImage(img) {
        img.src = img.data.src;
      }

      if ('IntersectionObserver' in window) {
        let observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
              observer.unobserve(entry.target)
              preloadImage(entry.target)
            }
          })
        }, config);
        images.forEach(image => observer.observe(image))
      } else {
        images.forEach(image => preloadImage(image))
      }
    </script>
  </body>
</html>
```

## 无限滚动

## Refs

1. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
1. [Intersection Observer API](https://w3c.github.io/IntersectionObserver/#intersection-observer-api)
1. [Lazy Loading Images Using Intersection Observer](https://deanhume.com/lazy-loading-images-using-intersection-observer/)
1. [Sticky Headers](https://developers.google.com/web/updates/2017/09/sticky-headers)
