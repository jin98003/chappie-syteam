/*
 HTTP Cloud Function.

 @param {Object} req Cloud Function request context.
 @param {Object} res Cloud Function response context.
*/

const mysql = require('mysql');

var sql = '';
var progressSql1 = '';
var progressSql2 = '';
var progressAll = '';
var progressPart = '';

var params = '';
var params2 = [];
var conn = mysql.createConnection({
   host : 'sqldb.cmsrxuizyrwq.ap-northeast-2.rds.amazonaws.com',
   user : 'mysql_db',
   password : 'syteam1111',
   database : 'syteam',
   port : 3306
 });

var query = '';
var searchNickname = ''; //email로 인해 찾은 nickname

conn.connect();

exports.helloHttp = function helloHttp (req, res) {
  var action = req.body.result['action'];
  var nickname = req.body.result.parameters['nickname'];
  var user_id = req.body.result.parameters['user_id'];
  var date = req.body.result.parameters['date'];
  var resolvedQuery = req.body.result['resolvedQuery'];
  var nowProjectName = '';
  var nowProjectId = '';
  var nowUserNickName = '';



  function todoFunction(callback){
    sql = 'SELECT T.TODO_LIST FROM TODO_LIST_TABLE T, TODO_MEMBER_TABLE M WHERE T.TODO_NO = M.TODO_NO AND M.MEMBER_NICKNAME = ? AND PROJECT_ID = ? AND TODO_COMPLETE= 0'
    params2 = [nickname, nowProjectId];
      conn.query(sql, params2, function(err, rows, fields){
           if(err){
             console.log(err);
             response = 'DB연결 실패ㅠㅠ' + err;
            //  app.tell('쿼리실패' + query);
             callback();
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
              if(query != ''){
                response = nickname + '의 할일은 "'+ query + '"입니다.';
              }else {
                response = nickname + '의 할일은 없습니다.';
              }
              callback();
           }
           response = 'test';
     });
   }

   function projectmemberListFunction(callback){
      conn.query(sql, params, function(err, rows, fields){
          if(err){
            console.log(err);
            response = 'DB연결 실패ㅠㅠ' + err;
            callback();
          } else{
            query = '';
            for(var i=0; i<rows.length;i++){
                if(i == rows.length - 1){
                    query += rows[i].MEMBER_NICKNAME;
                } else{
                    query += rows[i].MEMBER_NICKNAME + ', ';
                }
            }
            if(query != ''){
              response = params + ' 프로젝트의 멤버는 "' + query + '"입니다. 멤버를 추가하시겠습니까?';
            }else{
              response = params + ' 프로젝트의 멤버는 없습니다. 멤버를 추가하시겠습니까?'
            }
            callback();
          }
      });
   }

   function searchNicknameFuction(callback){
      var searchSQL = 'SELECT USER_NAME FROM USER_TABLE WHERE USER_ID = ?';
      params = user_id; //통째로 메일 받아올 수 있도록 고쳐야함(user say)
      conn.query(searchSQL, params, function(err, rows, fields){
          if(err){
            console.log(err);
            response = 'DB연결 실패ㅠㅠ' + err;
            callback();
          } else{
            searchNickname = rows[0].USER_NAME;
            // response = searchNickname;
            callback();
          }

      });
   }

   function projectinputMemberFunction(callback){
     sql = 'INSERT INTO MEMBER_TABLE VALUES(?, ?, ?, ?)';
     params2 = [nowProjectId, searchNickname, 'n', user_id];
     conn.query(sql, params2, function(err, rows, fields){
         if(err){
           console.log(err);
           response = 'DB연결 실패ㅠㅠ' + err;
           callback();
         } else{
           response = searchNickname + '('+ user_id + ') 님이 추가 되었습니다. 더 추가하시겠습니까?';
           callback();
         }
   });
 }

   function todowhodateFunction(callback){

     sql = 'SELECT TODO_LIST FROM TODO_LIST_TABLE L, TODO_MEMBER_TABLE M WHERE ? BETWEEN TODO_START_DATE AND TODO_END_DATE AND L.TODO_NO = M.TODO_NO AND M.MEMBER_NICKNAME = ? AND L.PROJECT_ID = ? AND TODO_COMPLETE = 0';
     params2 = [date, nickname, nowProjectId];
     conn.query(sql, params2, function(err, rows, fields){
         if(err){
           console.log(err);
           response = 'DB연결 실패ㅠㅠ' + err;
           callback();
         } else{
           query = '';
           for(var i=0; i<rows.length;i++){
             if(i == rows.length - 1){
                 query += rows[i].TODO_LIST;
             } else{
                 query += rows[i].TODO_LIST + ', ';
             }
           }
            if(query != ''){
              response = nickname + '의 '+ date + '에 할일은 "' + query + '"입니다.';
            }else {
              response = nickname + '의 ' + date + '에 할일은 없습니다.';
            }
            callback();
         }
    });
   }

   function tododelayallFunction(callback){
      sql = 'SELECT TODO_LIST FROM TODO_LIST_TABLE WHERE NOW() > TODO_END_DATE AND TODO_COMPLETE = 0 AND PROJECT_ID = ?'
      params = nowProjectId;
      conn.query(sql, params, function(err, rows, fields){
        if(err){
          console.log(err);
          response = 'DB연결 실패ㅠㅠ' + err;
          callback();
        } else{
           query = '';
           for(var i=0; i<rows.length;i++){
             if(i == rows.length - 1){
                 query += rows[i].TODO_LIST;
             } else{
                 query += rows[i].TODO_LIST + ', ';
             }
           }
           if(query != ''){
             response = '지연된 일은 "' + query + '"입니다.';
           }else {
             response = '지연된 일이 없습니다.';
           }
          callback();
        }
      });
   }

   function tododelaywhoFunction(callback){
     sql = 'SELECT T.TODO_LIST FROM TODO_LIST_TABLE T, TODO_MEMBER_TABLE M WHERE NOW() > TODO_END_DATE AND TODO_COMPLETE = 0 AND T.TODO_NO = M.TODO_NO AND M.MEMBER_NICKNAME = ? AND T.PROJECT_ID = ?'; //TEMP 프로젝트 넣어야(카테고리, 프로젝트?)
     params2 = [nickname, nowProjectId];
     conn.query(sql, params2, function(err, rows, fields){
       if(err){
         console.log(err);
         response = 'DB연결 실패ㅠㅠ' + err;
         callback();
       } else{
         query = '';
         for(var i=0; i<rows.length;i++){
           if(i == rows.length - 1){
               query += rows[i].TODO_LIST;
           } else{
               query += rows[i].TODO_LIST + ', ';
           }
         }
         if(query != ''){
           response = nickname + '의 지연된 일은 "' + query + '"입니다.';
         }else {
           response = nickname + '의 지연된 일이 없습니다.';
         }
        callback();
       }
     });
   }

   function progressAllFunction(callback){
        progressSql1 = 'SELECT COUNT(*) AS ALLC FROM TODO_LIST_TABLE WHERE PROJECT_ID = ?';
        params = nowProjectId;
        conn.query(progressSql1, params, function(err, rows, fields){
          if(err){
            console.log(err);
            response = 'DB연결 실패ㅠㅠ' + err;
            callback();
          } else{
              progressAll = rows[0].ALLC;
              // response = progressAll;
              callback();
          }
        });
    }

    function progressPartFunction(callback){
        progressSql2 = 'SELECT COUNT(*) AS PARTC FROM TODO_LIST_TABLE WHERE PROJECT_ID = ? AND TODO_COMPLETE=1';
        params = nowProjectId;
        conn.query(progressSql2, params, function(err, rows, fields){
          if(err){
            console.log(err);
            response = 'DB연결 실패ㅠㅠ' + err;
            callback();
          } else{
              progressPart = rows[0].PARTC;
              callback();
          }
        });
    }

    function categoryListFunction(callback){
      sql = 'SELECT CATEGORY_NAME FROM CATEGORY_TABLE WHERE PROJECT_ID = ?';
      params = nowProjectId;
      conn.query(sql, params, function(err, rows, fields){
        if(err){
          console.log(err);
          response = 'DB연결 실패ㅠㅠ' + err;
          callback();
        } else{
          query = '';
          for(var i=0; i<rows.length;i++){
            if(i == rows.length - 1){
                query += rows[i].CATEGORY_NAME;
            } else{
                query += rows[i].CATEGORY_NAME + ', ';
            }
          }
          if(query != ''){
            response = '현재 프로젝트의 카테고리는 "' + query + '"입니다.';
          }else {
            response = '현재 프로젝트의 카테고리는 없습니다.';
          }
         callback();
        }
      });
    }


   function nowProjectNameFunction(callback){
     var projectNameSql = 'SELECT CONNECTION_TIME, PROJECT_NAME FROM TEMP_TABLE ORDER BY CONNECTION_TIME DESC LIMIT 1';
     conn.query(projectNameSql, function(err, rows, fields){
       if(err){
         console.log(err);
         response = 'DB연결 실패ㅠㅠ' + err;
         callback();
       } else{
         nowProjectName = rows[0].PROJECT_NAME;
         callback();
       }
   });
 }

 function nowProjectIdFunction(callback){
     var projectIdSql = 'SELECT CONNECTION_TIME, PROJECT_ID FROM TEMP_TABLE ORDER BY CONNECTION_TIME DESC LIMIT 1';
     conn.query(projectIdSql, function(err, rows, fields){
       if(err){
         console.log(err);
         response = 'DB연결 실패ㅠㅠ' + err;
         callback();
       } else{
         nowProjectId = rows[0].PROJECT_ID;
         callback();
       }
   });
 }

function nowUserNickNameFunction(callback){
    var userNickNameSql = 'SELECT CONNECTION_TIME, USER_NAME FROM TEMP_TABLE ORDER BY CONNECTION_TIME DESC LIMIT 1';
    conn.query(userNickNameSql, function(err, rows, fields){
      if(err){
        console.log(err);
        response = 'DB연결 실패ㅠㅠ' + err;
        callback();
      } else{
        nowUserNickName = rows[0].USER_NAME;
        callback();
      }
  });
}




    if(action == 'todo.nickname'){ // 프로젝트 넣는 걸로 바꾸기.
       nowProjectIdFunction(function(){
          todoFunction(function(){
              res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
              res.send(JSON.stringify({ "speech": response, "displayText": response  }));
            });
        });
    }else if (action == 'project.memberlist') {

          sql = 'SELECT M.MEMBER_NICKNAME FROM PROJECT_TABLE P, MEMBER_TABLE M WHERE P.PROJECT_ID = M.PROJECT_ID AND PROJECT_NAME = ?'
          nowProjectNameFunction(function(){
            response = nowProjectName;
            params = nowProjectName;
            projectmemberListFunction(function(){
              res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
              res.send(JSON.stringify({ "speech": response, "displayText": response  }));
            });
          });

    }else if (action == 'project.inputMember'){
          searchNicknameFuction(function(){
            nowProjectIdFunction(function(){
              projectinputMemberFunction(function(){
              res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
              res.send(JSON.stringify({ "speech": response, "displayText": response  }));
            });
          });
        });
    }else if(action == 'todo.who.date'){
        if(nickname == '내'){
           nowUserNickNameFunction(function(){
             nickname = nowUserNickName;
           });
        }
        nowProjectIdFunction(function(){
          todowhodateFunction(function(){
            res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
            res.send(JSON.stringify({ "speech": response, "displayText": response  }));
          });
        });
    }else if(action == 'todo.delay.all'){
      nowProjectIdFunction(function(){
        tododelayallFunction(function(){
          res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
          res.send(JSON.stringify({ "speech": response, "displayText": response  }));
        });
      });
    }else if(action == 'todo.delay.who'){
      if(nickname == '내'){
         nowUserNickNameFunction(function(){
           nickname = nowUserNickName;
         });
      }
      nowProjectIdFunction(function(){
        tododelaywhoFunction(function(){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ "speech": response, "displayText": response  }));
        });
      });
    }else if(action == 'progress.all'){
        nowProjectIdFunction(function(){
           progressAllFunction(function(){
              progressPartFunction(function(){
                  // response = '전체 : ' + progressAll;
                  var progressAllResult = (progressPart / progressAll) * 100;
                  response = '현재 프로젝트의 전체의 진척도는 ' + progressAllResult.toFixed(1) + '% 입니다.';
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({ "speech": response, "displayText": response  }));
              });
           });
        });
    }else if(action == 'progress.category.list'){
        nowProjectIdFunction(function(){
          categoryListFunction(function(){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ "speech": response, "displayText": response  }));
          });
        });
    }
};
