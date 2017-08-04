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
