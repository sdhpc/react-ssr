import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { getIndexList } from '../store/index'
import styles from './Index.css'
import withStyle from '../withStyle'

function Index(props) {
  const [count, setCount] = useState(1)
  useEffect(() => {
    if(!props.list.length){
      //客户端来获取
      props.getIndexList()
    }
  }, [])
  return <div className={styles.container}>
    <h1 className={styles.title}>首页</h1>
    <div>{count}</div>
    <button onClick={() => setCount(count + 1)}>累加</button>
    <ul>
      {
        props.list.map(item => {
          return <li key={item.id}>{item.name}</li>
        })
      }
    </ul>
  </div>
}
Index.loadData = (store)=>{
  return store.dispatch(getIndexList())
}
export default connect(
  state => ({list: state.index.list}),
  {getIndexList}
)(withStyle(Index,styles))

// const newIndex = connect(
//   state => ({list: state.index.list}),
//   {getIndexList}
// )(withStyle(Index,styles))

// newIndex.loadData = (store)=>{
//   return store.dispatch(getIndexList())
// }

// export default newIndex