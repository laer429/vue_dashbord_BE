const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql'); 
const cors = require('cors');
const bodyParser = require('body-parser');

//request 객체의 body에 대한 url encoding을 확장 할 수 있도록 설정
app.use(bodyParser.urlencoded({extended:true}));
//req.body에 오는 데이터를 json 형식으로 변환
app.use(bodyParser.json());
app.use(cors());

const conn = {
    host : '127.0.0.1',
    port : '3306',
    user : 'root',
    password : 'password',
    database : 'new_dashboard'
};
// DB 커넥션 생성
const connection = mysql.createConnection(conn); 
// DB 접속
connection.connect();   
console.log('db success');

//게시판 1,2,3 조회
app.get('/1', (req,res) => {
    connection.query('select * from new_dashboard.dashboard where page_id = ?',1, function(error,results,fields) {
        res.send(results);
    })
});

app.get('/2', (req,res) => {
    connection.query('select * from new_dashboard.dashboard where page_id = ?',2, function(error,results,fields) {
        res.send(results);
    })
});

app.get('/3', (req,res) => {
    connection.query('select * from new_dashboard.dashboard where page_id = ?',3, function(error,results,fields) {
        res.send(results);
    })
});



//글 내용 조회
app.get('/:id',(req, res) => {
    const id = req.params.id;
    connection.query('select * from new_dashboard.dashboard where id = ?', id, function(error, results, fields) {
        if (error) {
            console.error(error);
            res.statusCode();
        };
        res.send(results);
    });
});


//글 쓰기 등록
app.post('/create', (req,res) => {
    let datas = [
        req.body.writer,
        req.body.content,
        req.body.title,
        req.body.page_id
    ];
    console.log('data:',datas)
    console.log('redirect')
    connection.query("insert into dashboard values(?,?,?,now(),now(),null,?)",datas, function (error, results, fields) {
        if (error) throw error;
        res.redirect('http://localhost:3000/list');
    res.send('post complete')
    });
});

// 글 수정
app.put('/create', (req,res) => {
    let datas = [
        req.body.writer,
        req.body.content,
        req.body.title,
        req.body.id
    ];
    console.log('data:',datas)
    console.log('redirect')
    connection.query("update new_dashboard.dashboard set writer = ?, content = ?, title = ?, updated_at= now() where id = ?",datas,function (error, results, fields) {
        if (error) throw error;
        res.send('post complete')
    });
})


// //글 삭제
app.delete('/:id', (req,res) => {
    let id = req.params.id;
    connection.query("delete from new_dashboard.dashboard where id = ?;",id, function (error, results, fields) {
        if (error) throw error;
        res.send('delete complete');
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})