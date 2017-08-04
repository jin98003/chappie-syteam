//
var express = require('express');
var bodyParser = require('body-parser');
var app = express(); //불러온 모듈은 사실 함수

app.set('view engine', 'jade'); //사용할 템플릿 엔진.
app.set('views', './views'); //템플리트가 있는 디렉토리

app.use(express.static('public')); // public directory를 정적인 걸로..(정적인 파일이 위치할 디렉토리설정)
app.use(bodyParser.urlencoded({ extended: false}))

app.get('/template', function(req, res){
  res.render('temp'); //temp템플릿 파일을 웹페이지로 렌더링해서 전송한다.
})

app.get('/', function(req, res){
    res.send('Hello home page');

}); // get방식

app.get('/topic/:id', function(req, res){ //시멘틱 웹 스타일
  var topics = [
      'Javascript is...',
      'Nodejs is...',
      'Express is...'
  ];
  var output = `
  <a href="/topic/0">JavaScript</a><br>
  <a href="/topic/1">Nodejs</a><br>
  <a href="/topic/2">Express</a><br><br>
  ${topics[req.params.id]}
  `

  res.send(output);

})

app.get('/topic/:id/:mode', function(req, res){
  res.send(req.params.id+','+req.params.mode)
});
app.get('/dynamic', function(req, res){
  var lis = '';
  for(var i = 0; i < 10; i++){
    lis = lis + '<li>coding</li>';
  }
  var time = Date();
  var output = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
        Hello, Dynamic !
        <ul>
        ${lis}
        </ul>
        ${time}
    </body>
  </html>`  //줄 띄기 가능
  res.send(output);
});

app.get('/route', function(req, res){
  res.send('Hello Router,<img src="/welshe.jpg">');
});
app.get('/login', function(req, res){
  res.send('<h1>Login Page</h1>');
});
app.listen(3000, function(){ //3000번 포트를 들으면 아래 함수가 실행
  console.log("Connected 3000 port!");
});
