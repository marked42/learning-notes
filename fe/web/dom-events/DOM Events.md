# DOM Events

### Event Fundamentals

```ts
interface Event {

}

interface EventTarget{
  void addEventListener(type: String, callback: EventListener, options?: Boolean | AddEventListenerOptions)
  void removeEventListener(type: String, callback: EventListener, options?: Boolean | EventListenerOptions)
  boolean dispatchEvent(Event event)
}

type FunctionEventListener = (event: Event) => Boolean

type ObjectEventListener = { handleEvent: FunctionEventListener }

type EventListener = FunctionEventListener | ObjectEventListener


interface EventListenerOptions {
  capture: Boolean = false,
}

interface AddEventListenerOptions : EventListenerOptions {
  passive: Boolean = false,
  once: Boolean = false,
}
```


#### Event Handler

Add handler for `click` event using DOM property `onclick`

```html
<input id="elem" type="button" value="Click me">
<script>
  elem.onclick = function() {
    alert('Thank you');
  };
</script>
```

Add handler for `click` event in html element attribute.

```javascript
<input type='button' value='Click me' onclick="alert(this.value)">
```

Under the background, `onclick` attribute is actually transformed to an event and added to corresponding DOM property.

```javascript
let handler = new Function("alert(this.value)");
elem.onclick = handler;
```

Add event handler using `addEventListener(event, handler[, phase])`, remove event handlers with `removeEventListener(event, handler[, phase])`. Exact event handler must be passed to remove it. A event handler is distinguished from another by three factors.

1. event type,
1. handler function
1. registered phase (capture or bubble)

Other options like `passive` and `once` are insignificant here. Adding same event handler multiple times is the same as adding it once, event handler will only be called once.

```js
function handler(e) {
  console.log('handle: ', e)
}

element.addEventHandler('click', handler, { capture: true })
element.addEventHandler('click', handler, { capture: true })  // no effect
```

```javascript
elem.addEventListener("click", () => alert("Thanks!"));
// Not working, two different arrow function.
elem.removeEventListener("click", () => alert("Thanks!"));
```

Multiple handlers can be added with `addEventListener()`, and they are called in the same order when they are added.

Some event handlers only work with `addEventListener` like `transitioned` event (CSS animation finished).

```javascript
button.addEventListener("click", () => alert("1"));
button.removeEventListener("click", () => alert("1"));
button.onclick = () => alert(2);

// triggers 1 and 2
```

`button.onclick` only accepts a single handler function, and it works independent of as well as in addition to `addEventListener`.

#### Dispatch An Event

Dispatch an event.

```javascript
/*
* throws {UNSPECIFIED_EVENT_TYPE_ERR} if event type is null, empty string or not specified in constructor.
* returns {boolean} false if event is cancelable and at least one of corresponding event handlers called `event.preventDefault()`, `true` otherwise.
*/
cancelled = !target.dispatchEvent(event);
```

### Event Bubbling and Capturing

When an event happens, it goes through 3 phases of event processing.

| Phase          | Explaination                                               |
| -------------- | ---------------------------------------------------------- |
| Capture Phase  | Events passed downward from root element to target element |
| Target Phase   | Events on target element                                   |
| Bubbling Phase | Events bubbling upward from target element to root element |

Event handlers can be invoked in any phase.

1. Use `element.addEventListener(event, handler, true)` to add handlers to be invoked in capture phase at `element`.
1. Use `element.addEventListener(event, handler)` or `element.addEventListener(event, handler, false)` or `element.on(event, handler)` to add handlers to be invoke in bubbling phase.
1. Target phase handlers can be divided as capture phase handlers and bubbling phase handlers. They are added with corresponding method as above. Capture phase event handlers on target element are invoked firstly, then bubbling phase event handlers on target element are invoked.

During the process of event flow, `event.target` is always the target element, `<td>` in this case, `this` in handler and `event.currentTarget` points to current element event is on, `event.eventPhase` is `1` for capture phase, `2` for target phase and `3` for bubbling phase.

Execution order of event handlers are the same as event flow.

1. Capture phase handlers first, target phase handlers second, bubbling phase handlers last.
1. Inside target phase, execution order of two types of event handlers follow the same rule.
1. Multiple event handlers can be added to single element. First added event handlers are invoked first.

![Event Flow](./eventflow.png)

Normal event flow can be changed inside handler function.

1. `event.stopPropagation()` can stop event from passing to next element both inside capture phase and bubbling phase. But it cannot prevent event handlers on same element from being invoked.
1. Use `event.stopImmediatePropagation()` to prevent event handlers on same element from being invoked and stop normal event flow.

Though normal event flow can be changed manually, but don't do it without obvious benefit and clear intention. For example, if event is stopped in bubbling phase on an element, we are not able to catch this event on root element to perform some general operation like dragging.

Almost all events go through bubbling phase, but there're exceptions. `focus` event is not bubbled up by default.

`event.preventDefault()` prevents default behavior of event from happening.

### Event Delegation

Since there's the bubbling phase of events, events on descendant element can be handled on ancestor element, this is called event delegation, which means to delegate events on descendant element to ancestor element. `event.target` gives us original element where event happened, `event.currentTarget` gives us current element where event is handled, so that we have complete information to handle event that interests us.

This can simplifies handler code and reduces memory usage, since we can handle multiple events in single handler on ancestor element instead of adding one handler for each descendant element. DOM structure of descendant elements can change as long as ancestor handler logic is not broken by it.

Event delegation requires event bubbling to work properly, and it takes a remote risk for handling unecessary descendant events on ancestor element.

### Browser Default Action

There are default behaviors by browser for certain events.

1. A click on a link cause web page to go to destination address.
1. A click on submit button inside a form causes form to be submitted.
1. Pressing a mouse button over a text and moving it selects text.

These default actions can be prevented.

1. Use `event.preventDefault()` inside handler.
1. Return `false` inside handler if handler is added by `on<event>` property (not by `addEventListener`). Return value of event handler are ignored in most cases, only `return false` inside handlers added by `on<event>` are processed and indicates to prevent default action. A explicit `return true` is not needed.

There are some events incurred by other events. Like `click` event on `input` element will trigger `focus` event automatically. If we prevent default behavior of `click` event on `input` element, it will not be focused automatically. Be careful in these cases.

If an event on descendant element is handled manually and its default actions are prevented, `event.defaultPrevented` will be `true`. The event follows the normal event flow and bubbles up to ancestor element, if it's not appropriate to handle the event again on ancestor element, check value of `event.defaultPrevented` and handle accordingly. Typical case would be two context menus pops up if `contextmenu` event is handle both on descendant and on ancestor element.

### Passive Event & Scroll Jank

On mobile browsers, when user touches to scroll a web page, it's expected that the web page scrolls instantly and sticks to position of user finger. When there's a human sensible lag behind between web page scroll and user touch action, it's called scroll jank. Scroll jank happens for mainly two reasons.

1. Expensive event handler function are registered to 'touchmove' event.
1. 'touchmove' event handler may invoke `e.preventDefault()` to cancel scrolling behavior (default behavior of 'touchmove' event), so scrolling behavior must wait until 'touchmove' event handlers finishes to make sure it's not prevented. This waiting process delays scrolling behavior and produces scroll jank.

Expensive event handler callback should not be added to 'touchmove' event, and better use `debounce` or `throttle` to control number of executions of original event handler.

However, for `TouchEvent` and `WheelEvent`, empty event handler also has a significant impact on performance due to second reason. So don't add any empty event handler if not needed.

> Unfortunately, some event APIs have been designed such that implementing them efficiently requires observing event listeners. This can make the presence of listeners observable in that even empty listeners can have a dramatic performance impact on the behavior of the application.

Statistics show that over 80% of touch events never cancel scrolling, so it's meaningless to delay scrolling behavior.

> For instance, in Chrome for Android 80% of the touch events that block scrolling never actually prevent it. 10% of these events add more than 100ms of delay to the start of scrolling, and a catastrophic delay of at least 500ms occurs in 1% of scrolls.

Passive event is introduced to instructs browsers to scroll instantly without waiting and saves us from scroll jank in most cases. `touchstart`, `touchmove` and `wheel` event supports passive event handler.

```js
element.addEventListener('touchmove', () => {
  console.log('touchmove called')
}, {
  passive: false,
})
```

`addEventListener` accepts a third argument that specifies registered event handler is passive, which promises to not call `e.preventDefault()` inside event handler to cancel scrolling behavior. In this case, scrolling happens instantly without waiting. Actually, any invocation of `e.preventDefault()` is ignored inside passive event handler.

Passive event is used in a all or none way. Because browsers can only optimize scrolling when all event handlers of one type on same element are passive, when there's any non-passive event handler, scrolling behavior has to wait.

Since Chrome 51, Firefox 49 and IOS Safari 10.3, passive event handler is supported. And for `touch` and `wheel` event, passive option defaults to `true` for a smooth scrolling behavior.

For more scenarios, refer to [this](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#removing-the-need-to-cancel-events).

Firefox provides scrolling optimization with [Asynchronous Panning and Zooming](https://hacks.mozilla.org/2016/02/smoother-scrolling-in-firefox-46-with-apz/)

Reference:

1. [Improving Scroll Performance with Passive Event Listeners](https://developers.google.com/web/updates/2016/06/passive-event-listeners)
1. [Passive event listeners](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)
1. [DOM Spec](https://dom.spec.whatwg.org/#dom-addeventlisteneroptions-passive)
1. [Observing event listeners](https://dom.spec.whatwg.org/#observing-event-listeners)
1. [New APIs to help developers improve scroll performance](https://blog.chromium.org/2016/05/new-apis-to-help-developers-improve.html)
1. [passive的事件监听](https://www.cnblogs.com/ziyunfei/p/5545439.html)

#### Feature Detection

Since passive event is not supported universally, it's best that we can detect whether browser supports it for compatibility. Use [detect it](https://github.com/rafrex/detect-it) or [modernizr](https://github.com/Modernizr/Modernizr/pull/1982) directly or polyfill below.

```js
// Test via a getter in the options object to see if the passive property is accessed
var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
    }
  });
  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {}

// Use our detected result, passive applied if supported, capture will be false either way.
elem.addEventListener('touchstart', fn, supportsPassive ? { passive: true } : false);
```

#### Disable Rubber Band Effect

Rubber band effect is a special scrolling behavior of `document.body` element implemented on IOS safari, other browsers don't support this. Previously, `e.preventDefault()` can be used to prevent scrolling behavior, including rubber band effect.

```js
document.body.addEventListener('touchmove', function(e) {
  e.preventDefault()
})
```

But on IOS safari 11, passive event is introduced and defaults to `true` which ignores `e.preventDefault()`, so that code above no longer works, we have to specify `passive` as `false` explicitly to cancel rubber band effect.

```js
document.body.addEventListener('touchmove', function(e) {
  e.preventDefault()
}, { passive: false })
```

Reference:

1. [阻止微信浏览器下拉滑动效果（ios11.3 橡皮筋效果）](https://segmentfault.com/a/1190000014134234)

### Synthetic Event

Synthetic events are script generated built-in type events.

```javascript
/*
* bubbles: whether event bubbles up.
* cancelable: whether event can be cancelled.
* composed: whether event will trigger listeners outside of a shadow root
*/
interface EventOption {
    bubbles?: boolean = false;
    cancelable?: boolean = false;
    composed?: boolean = false;
}

let event = new Event(type: DOMString, options?: EventOption)
```

Use `element.dispatchEvent(event)` to dispatch Synthetic event on an element. `event.isTrusted` is a boolean value to tell apart events generated by user actions and scripts, `true` for user generated events, `false` for script generated events.

Note that general event constructor doesn't accept data except `bubbles`, `cancelable` and `composed`, choose an appropriate sub event constructor if extra data are required.

```javascript
let event = new MouseEvent("click", {
  bubbles: true,
  cancelable: true,
  clientX: 100, // ignored in general event constructor
  clientY: 100 // ignored in general event constructor
});
```

Synthetic events are often used to simulate user actions in automatic testing.

```javascript
function simulateClick() {
  var event = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true
  });
  var cb = document.getElementById("checkbox");
  var cancelled = !cb.dispatchEvent(event);
  if (cancelled) {
    // A handler called preventDefault.
    alert("cancelled");
  } else {
    // None of the handlers called preventDefault.
    alert("not cancelled");
  }
}
```

There exists an old-fashioned way of constructing events using `initEvent(type, bubbles, cancelable)`, it's already deprecated.

### Custom Event

Use `CustomEvent` to generate customized event with an event type different from any built-in events. `CustomEvent` is same as `Event` with one exception that it accepts a property `detail` in second argument of constructor. `detail` property avoids clash with built-in event type and passes data required by custom event.

```javascript
let event = new CustomEvent("unique-type", {
  detail: { name: "John" }
});
```

`element.dispatch(customEvent)` returns `false` and `customEvent.defaultPrevented` is `true` if custom event is cancelable and `event.preventDefault()` is called. Check it to apply some default actions for custom event.

```html
<pre id="rabbit">
  |\   /|
   \|_|/
   /. .\
  =\_Y_/=
   {>o<}
</pre>

<script>
  // hide() will be called automatically in 2 seconds
  function hide() {
    let event = new CustomEvent("hide", {
      cancelable: true // without that flag preventDefault doesn't work
    });
    if (!rabbit.dispatchEvent(event)) {
      alert('the action was prevented by a handler');
    } else {
      rabbit.hidden = true;
    }
  }

  rabbit.addEventListener('hide', function(event) {
    if (confirm("Call preventDefault?")) {
      event.preventDefault();
    }
  });

  // hide in 2 seconds
  setTimeout(hide, 2000);

</script>
```

### Events-in-events are synchronous

TODO:

1. add listener during dispatch
1. multiple identical listener
1. `this` in listener

Usually events are processed asynchronously. If during the process of one event, other events are triggered by users, browsers will first finish handling current event and then keep handling newly triggered events in a sequential order.

However, if other event is dispatched inside an event handler, browser will first handles newly triggered event, then resume execution of current event handler.

```html
<button id="menu">Menu (click me)</button>

<script>
  // 1 -> nested -> 2
  menu.onclick = function() {
    alert(1);

    // alert("nested")
    menu.dispatchEvent(new CustomEvent("menu-open", {
      bubbles: true
    }));

    alert(2);
  };

  document.addEventListener('menu-open', () => alert('nested'))
</script>
```

Dispatch event at the end of handler function or use `setTimeout(..., 0)` for an asynchronous event.

```html
<button id="menu">Menu (click me)</button>

<script>
  // 1 -> 2 -> nested
  menu.onclick = function() {
    alert(1);

    // alert(2)
    setTimeout(() => menu.dispatchEvent(new CustomEvent("menu-open", {
      bubbles: true
    })), 0);

    alert(2);
  };

  document.addEventListener('menu-open', () => alert('nested'))
</script>
```

### Detailed Event

[Detailed event](http://javascript.info/event-details)
