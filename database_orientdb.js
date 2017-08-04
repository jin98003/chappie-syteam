var OrientDB = require('orientjs');

var server = OrientDB({ //db실행 될때 객체 전달
  host: 'localhost',  //다른 컴퓨터에 있으면 도메인을 써야
  port: 2424,
  username: 'root',
  password: '1174'
});

var db = server.use('o2'); //o2 database
/*
db.record.get('#22:0').then(function(record){ //해당 rid의 행을 가져옴
  console.log('Loaded record:', record);
});
*/

//create
/*
var sql = 'select from topic';
db.query(sql).then(function(results){
  console.log(results);
});
*/

/*
var sql = 'select from topic where @rid=:id';
var param = {
  params:{ //약속 params
    id:'#21:0'

  }
};
db.query(sql, param).then(function(results){
  console.log(results);
});
*/

/*
var sql = "insert into topic (title, description) values(:title, :desc)";
var param = {
   params:{
      title:'Express',
      desc:'Express is framework'

   }
}
db.query(sql, param).then(function(results){
  console.log(results);
})
*/

//update
/*
var sql = "update topic set title=:title where @rid=:rid";
db.query(sql, {params:{title:'Expressjs', rid:'#21:1'}}).then(function(results){
  console.log(results);
})
*/

// delete
var sql = "delete from topic where @rid=:rid";
db.query(sql, {params:{rid:'#21:1'}}).then(function(results){
  console.log(results);
});
