//这里的node代码。会用babel处理
import React from 'react';
import { renderToString } from 'react-dom/server'
import {Provider} from 'react-redux'
import express from 'express'
import {StaticRouter,matchPath,Route} from 'react-router-dom'
import routes  from '../src/App'
import {getServerStore} from '../src/store/store'
import Header from '../src/component/Header'

const store = getServerStore() 
const app = express()
app.use(express.static('public'))
app.get('*', (req, res) => {
  //获取根据路由渲染出的组件，并拿到loadDAata方法 获取数据

  //储存网络请求
  const promise = [];
  //路由匹配
  routes.some(route=>{
    const match = matchPath(req.path,route)
    if(match){
      const {loadData} = route.component
      if(loadData){
        // promise.push(loadData(store))
        promise.push(
          //第一个作业
          new Promise(function(resolve,reject){
              loadData(store).then(()=>{resolve()}).catch((e)=>{
                 // console.log(e);
                  resolve()
              })
          })
        )
      }
    }
  })
  // routes.some(route=>{
  //   const match = matchPath(req.path,route);
  //   if(match) promise.push(route.loadData(match));
  //   return match;
  // })

  //等待所有请求结束再渲染
  Promise.all(promise).then(()=>{
    //把react组件解析成html
    const content = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url}>
          <Header></Header>
          {routes.map(route=><Route {...route}></Route>)}
        </StaticRouter>
      </Provider> 
    )
    //字符串模板
    res.send(`
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>服务端渲染</title>
        </head>
        <body>
          <div id="root" style="background:aliceblue;">${content}</div>
          <script>
            window.__context=${JSON.stringify(store.getState())}
          </script>
          <script src="/bundle.js"></script>
        </body>
      </html>
    `)
  }).catch(()=>{
    res.send('报错了')
  })
})
app.listen(9093,()=>{
    console.log(`9093监听完毕`)
})
