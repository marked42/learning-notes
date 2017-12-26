# Javascript

## DOM Event

### Event Fundamentals

### Event Bubbuling and Capturing

When an event happens, it goes through 3 phases of event processing.

| Phase | Explaination |
|--|--|--|--| -- |
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

If an event on descendant element is handled manually and its default actions are prevented, `event.defaultPrevented` will be `true`. The event follows the normal event flow and bubbles up to ancestor element, if it not appropriate to handle the event again on ancestor element, check value of `event.defaultPrevented` and handle accordingly. Typical case would be two context menus pops up if `contextmenu` event is handle both on descendant and on ancestor element.

### Custom Event

### Reference

1. [Browser: Document, Event, Interfaces](https://javascript.info/ui)
1. [DOM Events Spec](https://www.w3.org/TR/DOM-Level-3-Events/)