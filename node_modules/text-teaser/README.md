# node-text-teaser

This is a wrapper for the [TextTeaser API](http://www.textteaser.com/)

## Installation

```
npm install text-teaser
```

### `#post()`

Send request to the API

```js
var key = process.env.TEXTTEASER_KEY
var subdomain = process.env.TEXTTEASER_DOMAIN || ''
var tt = require('text-teaser')(key, subdomain)

var data = {
  title: 'TITLE...............',
  text: 'TEXT...................'
}

tt.post(data, function(err, id){
  if (err) { /* handle err */ }
  console.log(id)
})
```

### `#get()`

Get the summarized content from the API

```js
var key = process.env.TEXTTEASER_KEY
var subdomain = process.env.TEXTTEASER_DOMAIN || ''
var tt = require('text-teaser')(key, subdomain)
var id = 123 // for example

tt.get(id, { count: 3 }, function(err, data){
  if (err) { /* handle err */ }
  console.log(data)
})
```

## Testing

```
TEXTTEASER_KEY=YOUR_KEY npm test
```

## LICENSE

MIT License
