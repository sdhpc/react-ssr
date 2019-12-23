//这里的node代码。会用babel处理
import React from 'react';
import { renderToString } from 'react-dom/server'
import {Provider} from 'react-redux'
import express from 'express'
import {StaticRouter,matchPath,Route,Switch} from 'react-router-dom'
import routes  from '../src/App'
import {getServerStore} from '../src/store/store'
import Header from '../src/component/Header'
import proxy from 'http-proxy-middleware'
import fs from 'fs'
import path from 'path'

const store = getServerStore() 
const app = express()
app.use(express.static('public'))

//客户端来的api开头的请求
app.use(
  '/api',
  proxy({
    target:'http://localhost:9090',
    changeOrigin:true
  })
)

function csrRender(res){
  //读取csr文件 返回
  const filename  = path.resolve(process.cwd(),'public/index.csr.html')
  const html = fs.readFileSync(filename,'utf-8')
  return res.send(html)
}

app.get('*', (req, res) => {
  if(req.query._mode=='csr'){
    console.log('url参数开启csr降级')
    csrRender(res)
  }
  //配置开关开启csr
  //服务器负载过高开启csr



  //获取根据路由渲染出的组件，并拿到loadDAata方法 获取数据

  // if(req.url.startsWith('/api/')){
  //   //不渲染页面使用axios转发 axios.get 
  // }

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
    const context = {
      css:[]
    }
    //把react组件解析成html
    const content = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <Header></Header>
          <Switch>
            {routes.map(route=><Route {...route}></Route>)}
          </Switch> 
        </StaticRouter>
      </Provider> 
    )
    // console.log('context', context)
    if(context.statuscode){
      //状态的切换和页面跳转
      res.status(context.statuscode)
    }
    if(context.action=='REPLACE'){
      //状态的切换和页面跳转
      res.redirect(301,context.url)
    }
    const css = context.css.join('\n')
    //字符串模板
    res.send(`
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>服务端渲染</title>
          <style>
            ${css}
          </style>
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
