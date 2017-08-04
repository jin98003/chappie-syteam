
var debug = require('debug')('textteaser')
var inspect = require('util').inspect
var merge = require('merge')
var path = require('path')
var request = require('request')

module.exports = TextTeaser

function TextTeaser(user, subdomain){
  if (false == this instanceof TextTeaser)
    return new TextTeaser(user, subdomain)
  this.wait = 300
  this.user = user
  this.root = 'http://' + (subdomain || 'api') + '.textteaser.com'
  debug('public / dedicated? %s', !!subdomain)
}

TextTeaser.prototype.post = function(data, next){
  var url = this.root + '/post'
  data = merge({ user: this.user }, data)
  debug('sending request to %s', url)
  debug('request data consists %s', Object.keys(data))
  request.post({ url: url, form: data }, function(err, res, body){
    if (err) return next(err)
    if (res.statusCode >= 400)
      return next(new Error(res.statusCode + ':' + res.text))
    try { body = JSON.parse(body) } catch(e) {}
    next(null, body.id)
  })
}

TextTeaser.prototype.get = function get(id, opts, next){
  if ('function' == typeof opts)
    next = opts, opts = {}

  var url = this.root + path.join('/get', this.user, ''+id)
  var tt = this

  debug('sending GET request to %s, with query %s', url, inspect(opts))

  request({ url: url, qs: opts, json: true }, function(err, res, body){
      if (err) return next(err)
      if (res.statusCode >= 400)
        return next(new Error(res.statusCode + ':' + res.text))

      body = body || {}

      var hasContent = true
      hasContent &= !!Object.keys(body).length
      hasContent &= body.status && 'pending' != body.status.toLowerCase()

      if (hasContent) return next(null, body)

      // summarization not ready yet
      var getAgain = get.bind(tt)
      setTimeout(function(){
        getAgain(id, opts, next)
      }, this.wait)
    })
}

