
var TextTeaser = require('../')
var assert = require('assert')
var data = require('./fixture')

var user = process.env.TEXTTEASER_KEY
var subdomain = process.env.TEXTTEASER_SUBDOMAIN
if (!user) throw new Error('missing TextTeaser key')

var tt = TextTeaser(user, subdomain)

describe('#get', function(){
  var id
  before(function(done){
    tt.post(data, function(err, _id){
      assert(!!err === false, 'should not have error')
      id = _id
      done()
    })
  })
  it('should return id given title and text', function(done){
    tt.get(id, function(err, data){
      assert(!!err === false, 'should not have error')
      assert(!!data.sentences.length)
      done()
    })
  })
  it('should return sentences based on count given', function(done){
    var count = 3
    tt.get(id, { count: count }, function(err, data){
      assert(!!err === false, 'should not have error')
      assert(count == data.sentences.length)
      done()
    })
  })
})
