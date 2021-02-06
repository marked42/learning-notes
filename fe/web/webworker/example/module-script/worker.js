import * as filters from './filters.js'

self.onmessage = (e) => {
  const { imageData, filter } = e.data

  filters[filter](imageData)

  postMessage(imageData, [imageData.data.buffer])
}
