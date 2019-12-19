import React from 'react'
import { connect } from 'react-redux'
import { getUserInfo } from '../store/user'
import {Redirect} from 'react-router-dom'
function User(props) {

//比如登陆逻辑判断
//没登录跳转登录页  
return<Redirect to="/about">

</Redirect>
  // return <div>
  //   <h1>你好{props.userinfo.name},你最棒的歌是{props.userinfo.best}</h1>
  // </div>
}
User.loadData = (store)=>{
  return store.dispatch(getUserInfo())
}
export default connect(
  state => {
    console.log(123,state.user.userinfo)
    return{
      userinfo: state.user.userinfo
    }
  }
)(User)