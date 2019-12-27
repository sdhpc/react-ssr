const express = require('express')
// /api开头的
const axios = require('axios')
const app = express()
app.get('*',function(req,res){
    console.log(req.url)
    if(req.url=='/favicon.ico'){
        res.send({code:0})
    }
    res.send({code:1})
})
app.listen(8089,()=>{
    console.log('ssr server start');
})