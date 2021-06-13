import React from 'react'
import './style.css'
import {useGlopalContext} from '../Context'

const Loading = () => {
 const {isLoading } = useGlopalContext()
 return (
  <div className={`${isLoading? 'loading-Component' :'loading-Component smooth-hide'}`}>
   <div>
    <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    <h3>please wait</h3>
   </div>
  </div>
 )
}

export default Loading
