//这里的node代码。会用babel处理
import React from 'react';
import { renderToString } from 'react-dom/server'
import {Provider} from 'react-redux'
import express from 'express'
import {StaticRouter} from 'react-router-dom'
import App from '../src/App'
import store from '../src/store/store'

const app = express()
app.use(express.static('public'))
app.get('*', (req, res) => {

  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        {App}
      </StaticRouter>
    </Provider>
  )
  res.send(`
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>服务端渲染</title>
      </head>
      <body>
        <div id="root" style="background:aliceblue;">${content}</div>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `)
})
app.listen(9093,()=>{
    console.log(`9093监听完毕`)
})
