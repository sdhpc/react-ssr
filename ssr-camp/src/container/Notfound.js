import React from 'react'
import { } from 'react-router-dom'

function Status({code,children}){
  return <Route render={({staticContext})=>{
    if(staticContext){
      staticContext.statuscode = 404 
    }
    return children
  }}></Route>
}


function Notfound(props) {
  // console.log('notfound',props)
  // 渲染了这个组件，给staticContext赋值 statuscode = 404
  return <Status code={404 }>
    <h1>404</h1>
  </Status>

}

export default Notfound