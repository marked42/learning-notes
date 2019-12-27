# Electron

- [Electron](#electron)
    - [Basic](#basic)
    - [BrowserWindow](#browserwindow)
        - [Create a Window](#create-a-window)
        - [Option Arguments](#option-arguments)
    - [App Menu](#app-menu)
    - [Inter-process Communication (IPC)](#inter-process-communication-ipc)
    - [Dialog Module](#dialog-module)
    - [WebContents](#webcontents)
    - [Auto Updating](#auto-updating)
    - [Reference](#reference)

## Basic

Electron has two types of process: the main process and the renderer process. Main process handles system-level activities (starting up, preparing to quit, quit) and is responsible for spawning renderer processes. Rendering prcoesses are responsible for rendering UI from specified HTML page and are isolated from system-level events. Electron provides a interprocess communication system to allow events and data to be passed back and forth between main process and renderer processes.

Each type of process is restricted to use a collection of modules.

![Main Renderer Process](./main_renderer_process.png)

## BrowserWindow

### Create a Window

Main process creates renderer processes by creating instances of the `BrowserWindow` object, which loads specific HTML page and uses Chromium to display it.

Entry point file of a electron app may contain codes below. Node is used to execute entry file and start up whole application.

```javascript
import { app, BrowserWindow } from 'electron'
import path from 'path'
import url from 'url'

// a BrowserWindow instance crresponds to a renderer process
let mainWindow = new BrowserWindow({ width: 800, height: 600 })

// specify source HTML page to display
mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html')
    protocol: 'file:',
    slashes: true,
}))

// wait for 'read-to-show' event to display our window
mainWindow.once('ready-to-show', () => {
    mainWindow.show()
})

// dereference window object on closed
mainWindow.on('closed', () => {
    mainWindow = null
})
```

Speicified URL parameter in `mainWindow.loadURL(pageURL)` is contents that will be displayed in corresponding renderer process.

### Option Arguments

`BrowserWindow` has a lot of options on construction to adjust display and behaviours of spawned window.

TODO: width, height, minWidth, minHeight, center, x, y, resizable, movable, title, frameless window, transparent window.

## App Menu

Electron uses _Menu_ module to create and manipulate application menus.

## Inter-process Communication (IPC)

IPC module enables main process and renderer processes to communicate with each other using events. Use `ipcMain` in main process and `ipcRenderer` in renderer processes.

Main process listen and responde messages from renderer processes using `ipcMain` module.

1. Listen messages using `ipcMain.on(channel, handler)` or `ipcMain.once(channel, handler)`.
1. Respond synchronous message with `event.returnValue = synchronousResponse`
1. Respond asynchronous message with `event.sender.send(asynchronouseResponse)`, `event.sender` is the source `webContents` of asynchronous message.
1. Remove listeners using `ipcMain.removeListner(channel, listener)` or `ipcMain.removeAllListeners([channel])`.

```javascript
// In main process.
const {ipcMain} = require('electron')

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg)  // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)  // prints "ping"
  event.returnValue = 'pong'
})
```

Renderer processes send and listen messages using `ipcRender` module.

1. Listen messages using `ipcRenderer.on(channel, listener)` or `ipcRenderer.once(channel, listener)`.
1. Send asynchronous message with `ipcRenderer.send(channel, arg)`.
1. Send synchronous message with `ipcRenderer.sendSync(channel, arg)`.
1. Send message to `<webview>` element on host page using `ipcRenderer.sendToHost(channel, [,arg1][, arg2][...])`
1. Remove listeners using `ipcRenderer.removeListner(channel, listener)` or `ipcRenderer.removeAllListeners([channel])`.

```javascript
// In renderer process (web page).
const {ipcRenderer} = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')
```

## Dialog Module

## WebContents

`webContents` module provides a way to get web contents of application.

```javascript
const { webContents } = require('electron')

// get all web contents
webContents.getAllWebContents()

// get focused web content
webContents.getFocusedWebContents()

// get web contents of id
webContents.fromId(id)
```

Each `BrowserWindow` has a `webContents` property referring to its own web contents.

## Auto Updating

auto-updater.

Events: error, checking-for-update, update-available, update-not-available, update-downloaded

## Reference

1. Electron: From Beginner to Pro
1. [electron-docs-gitbook](https://www.gitbook.com/book/imfly/electron-docs-gitbook/details)

Not published yet.

1. Building Cross-Platform Desktop Applications with Electron
1. Electron In Action
