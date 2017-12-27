# Javascript

## DOM Event

### Event Fundamentals

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
let handler = new Function("alert(this.value)")
elem.onclick = handler
```

Add event handler using `addEventListener(event, handler[, phase])`, remove event handlers with `removeEventListener(event, handler[, phase])`. Exact event handler must be passed to remove it.

```javascript
elem.addEventListener( "click" , () => alert('Thanks!'));
// Not working, two different arrow function.
elem.removeEventListener( "click", () => alert('Thanks!'));
```

Multiple handlers can be added with `addEventListner()`, and they are called in the same order when they are added.

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
* returns {boolean} false if event is cancellable and at least one of corrosponding event handlers called `event.preventDefault()`, `true` otherwise.
*/
cacelled = !target.dispatchEvent(event)
```

### Event Bubbuling and Capturing

When an event happens, it goes through 3 phases of event processing.

| Phase | Explaination |
|--|--|
|Capture Phase| Events passed downward from root element to target element|
|Target Phase|Events on target element|
|Bubbling Phase|Events bubbling upward from target element to root element|

Event handlers can be invoked in any phase.

1. Use `element.addEventListener(event, handler, true)` to add handlers to be invoked in capture phase at `element`.
1. Use `element.addEventListener(event, handler)` or `element.addEventListener(event, handler, false)` or `element.on(event, handler)` to add handlers to be invoke in bubbling phase.
1. Target phase handlers can be devided as capture phase handlers and bubbling phase handlers. They are added with corresponding method as above. Capture phase event handlers on target element are invoked firstly, then bubbling phase event handlers on target element are invoked.

During the process of event flow, `event.target` is always the target element, `<td>` in this case, `this` in handler and `event.currentTarget` points to current element event is on, `event.eventPhase` is `1` for capture phase, `2` for target phase and `3` for bubbling phase.

Execution order of event handlers are the same as event flow.

1. Capture phase handlers first, target phase handlers second, bubbling phase handlers last.
1. Inside target phase, execution order of two types of event handlers follow the same rule.
1. Multiple event handlers can be added to single element. First added event handlers are invoked first.

![Event Flow](./eventflow.png)

Normal event flow can be changed inside handler function.

1. `event.stopPropagation()` can stop event from passing to next element both inside capture phase and bubbling phase. But it cannot prevent event handlers on same element from being invoked.
1. Use `event.stopImmediatePropgation()` to prevent event handlers on same element from being invoked and stop normal event flow.

Though normal event flow can be changed mannualy, but don't do it without obvious benefit and clear intention. For example, if event is stopped in bubbling phase on an element, we are not able to catch this event on root element to perform some general operation like dragging.

Almost all events go through bubbling phase, but there're exceptions. `focus` event is not bubbled up by default.

`event.preventDefault()` prevents default behaviour of event from happening.

### Event Delegation

Since there's the bubbling phase of events, events on descendant element can be handled on ancestor element, this is called event delegation, which means to delegate events on desendant element to ancestor element. `event.target` gives us original element where event happened, `event.currentTarget` gives us current element where event is handled, so that we have complete information to handle event that interests us.

This can simplifies handler code and reduces memory usage, since we can handle multiple events in single handler on ancestor element instead of adding one handler for each descendant element. DOM structure of descendant elements can change as long as ancestor handler logic is not broken by it.

Event delegation requires event bubbling to work properly, and it takes a remote risk for handling unecessary descendant events on ancestor element.

### Browser Default Action

There are default behaviours by browser for certain events.

1. A click on a link cause web page to go to destination address.
1. A click on submit button inside a form causes form to be submitted.
1. Pressing a mouse button over a text and moving it selects text.

These default actions can be prevented.

1. Use `event.preventDefault()` inside handler.
1. Return `false` inside handler if handler is added by `on<event>` property (not by `addEventListener`). Return value of event handler are ignored in most cases, only `return false` inside handlers added by `on<event>` are processed and indicates to prevent default action. A explicit `return true` is not needed.

There are some events incured by other events. Like `click` event on `input` element will trigger `focus` event automatically. If we prevent default behaviour of `click` event on `input` element, it will not be focused automatically. Be careful in these cases.

If an event on descendant element is handled manually and its default actions are prevented, `event.defaultPrevented` will be `true`. The event follows the normal event flow and bubbles up to ancestor element, if it's not appropriate to handle the event again on ancestor element, check value of `event.defaultPrevented` and handle accordingly. Typical case would be two context menus pops up if `contextmenu` event is handle both on descendant and on ancestor element.

### Sythetic Event

Sythetic events are script generated built-in type events.

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

Use `element.dispatchEvent(event)` to dispatch sythetic event on an element. `event.isTrusted` is a boolean value to tell apart events generated by user actions and scripts, `true` for user generated events, `false` for script generated events.

Note that general event constructor dosen't accept data except `bubbles`, `cancelable` and `composed`, choose an appropriate sub event constructor if extra data are required.

```javascript
let event = new MouseEvent('click', {
    bubbles: true,
    cancelabel: true,
    clientX: 100,       // ignored in general event constructor
    clientY: 100        // ingored in general event constructor
})
```

Sythetic events are often simulate user actions in automatic testing.

```javascript
function simulateClick() {
  var event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  var cb = document.getElementById('checkbox'); 
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

There exists an old-fashioned way of constructing events using `initEvent(type, bubbles, cancellable)`, it's already deprecated.

### Custom Event

Use `CustomEvent` to generate customized event with an event type different from any built-in events. `CustomEvent` is same as `Event` with one exception that it accepts a property `detail` in second argument of constructor. `detail` property avoids clash with built-in event type and passes data required by custom event.

```javascript
let event = new CustomEvent('unique-type', {
    detail: { name: 'John' }
})
```

`element.dispatch(customEvent)` returns `false` and `customEvent.defaultPrevented` is `true` if custom event is cancellable and `event.preventDefault()` is called. Check it to apply some default actions for custom event.

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

### Events-in-events are synchronously

Usually events are processed asynchronously. If during the process of one event, other events are triggered by users, browsers will first finish handling current event and the keep handling newly triggered events in a sequential order.

However, if other event is dispatched inside an event handler, broswer will first handles newly triggered event, then resume execution of current event handler.

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

Dispatch event at the end of handler function or use `setTimeout(..., 0)` for an asynchrounous event.

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

### Reference

1. [Browser: Document, Event, Interfaces](https://javascript.info/ui)
1. [UI Events Specification](https://www.w3.org/TR/uievents/)
1. [Event Object API](https://developer.mozilla.org/en-US/docs/Web/API/Event)
1. [Event Reference](https://developer.mozilla.org/en-US/docs/Web/Events)
1. [Event Interface](https://dom.spec.whatwg.org/#interface-event)
1. [Custom Event Interface](https://dom.spec.whatwg.org/#customevent)