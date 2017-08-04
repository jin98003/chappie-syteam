var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.locals.pretty= true;
app.set('views', './views');
app.set('view engine', 'jade');
app.get('/topic/new', function(req, res){
  res.render('new');
})
app.post('/topic', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  res.send('Hi, post, '+req.body.title);

})
app.listen(3000, function(){
  console.log("Connected, 3000 port!!!");
})
