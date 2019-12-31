const express = require('express')
const puppeteer  = require('puppeteer')
// /api开头的
const axios = require('axios')
const app = express()


async function test(){
    console.log('截图')
    const broswer = await puppeteer.launch()
    const page = await broswer.newPage()
    await page.goto('https://kaikeba.com')
    await page.screenshot({path:'kaikeba.png'})
    await broswer.close()
}

// test()
const urlCache = {}
app.get('*',async function(req,res){
    console.log(req.url)
    // 遍历所有的路由都写成html文件或者都缓存上

    // 1.加缓存
    // 2.lru缓存算法
    if(urlCache[url]){
        return res.send(urlCache[url])
    }
    if(req.url=='/favicon.ico'){
        //对seo无影响
        res.send({code:0})
    }
    const url ='http://localhost:9093'+req.url
    const broswer = await puppeteer.launch()
    const page = await broswer.newPage()
    await page.goto(url,{
        waitUntil:['networkidle0']
    })
    const html = await page.content()
    console.log(html)
    urlCache[url] = html
    res.send(html)
})
app.listen(8081,()=>{
    console.log('ssr server start');
})