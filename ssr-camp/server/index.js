//这里的node代码，会用babel处理
import React from 'react'
import {renderToString} from 'react-dom/server'
import express from 'express'
import App from '../src/App'


const app = express()
app.use(express.static('public'))
app.get('/',(req,res)=>{
    //把react组件解析成html
    const content = renderToString(App)
    res.send(`
        <html>
            <head>
                <title> react ssr</title>
                <meta charset='utf-8'/>
            </head>
            <body>
                <div id="root">${content}</div>
                <script src="/bundle.js"></script>
            </body>
        </html>
    `)
})

app.listen(9093,()=>{
    console.log(`监听完毕`)
})