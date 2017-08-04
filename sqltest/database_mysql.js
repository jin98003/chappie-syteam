var mysql      = require('mysql');
var async = require('async');
var conn= mysql.createConnection({
  host     : 'sqldb.cmsrxuizyrwq.ap-northeast-2.rds.amazonaws.com',
  user     : 'mysql_db',
  password : 'cjdghk1174^^',
  database : 'syteam',
  port : 3306
  
});

if(!conn.connect()){
	console.log('연결실패');
}
else{
	console.log('연결성공');
}



// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });
//
// connection.end();
var query = '';
var sql = 'SELECT T.TODO_LIST as TODO_LIST FROM TODO_LIST_TABLE T, TODO_MEMBER_TABLE M WHERE T.TODO_NO = M.TODO_NO AND M.MEMBER_NICKNAME = ?';
var params = '요짱';
//'select T.TODO_LIST as tt from TODO_LIST_TABLE T, TODO_MEMBER_TABLE M where T.TODO_NO = M.TODO_NO';

  preFunction(function(){
    console.log('쿼리 ' + JSON.stringify(query));

  });

  function preFunction(callback){
    conn.query(sql, params, function(err, rows, fields){
          if(err){
            console.log(err);
          } else{
			  query = '';
			  for(var i=0; i<rows.length;i++){
				  console.log('로우즈 ' + rows[i].TODO_LIST);
				  if(i == rows.length - 1){
					query += rows[i].TODO_LIST;
				  }
				  else{
					query += rows[i].TODO_LIST +', ';
				  }
			  }
              console.log(params + '의 할일은 "'+ query + '"입니다');
              callback();
          }

    });

  }

conn.end();










//
// var sql = 'insert into todo_list_table(TODO_NO, CATEGORY_ID, TODO_LIST, TODO_START_DATE, TODO_END_DATE, TODO_PRIORITY, TODO_NOTE, TODO_COMPLETE ) ' +
//           'values(?, ?, ?, now(), now(), ?, ?, ?)'
// var params = ['3', ' 2024', 'LIST05', 'H', 'note', '2'];
// conn.query(sql, params, function(err, rows, fields){
//   if(err){
//     console.log(err);
//   } else{
//     console.log(rows.insertId);
//   }
// });
