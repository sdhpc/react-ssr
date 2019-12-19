const express = require('express')
let app = express()

app.get('/api/user/info',(req,res)=>{
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    // res.header("Content-Type", "application/json;charset=utf-8");
    res.json({
        code:0,
        data:{
            name:'周杰伦',
            best:'开不了口'
        }
    })
})

app.get('/api/course/list',(req,res)=>{

    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    // res.header("Content-Type", "application/json;charset=utf-8");
    res.json({
        code:0,
        list:[{
            name:'东风破',
            id:'0'
        },{
            name:'七里香',
            id:'1'
        },{
            name:'发如雪',
            id:'2'
        },{
            name:'菊花台',
            id:'3'
        }]
    })
})
app.listen(9090,()=>{
    console.log('启动完成')
})