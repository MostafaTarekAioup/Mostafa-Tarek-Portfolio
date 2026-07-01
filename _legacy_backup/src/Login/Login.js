import React from 'react'
import './style.css'
import LoginImg from '../Images/login-img.webp'
import background from '../Images/background-img.webp'
import {useGlopalContext} from '../Context'

const Login = () => {
 const {isLogin , setIsLogin} = useGlopalContext()
 return (
  <div className={`${isLogin? 'login-container smooth-hide-top':'login-container'}`}>
   <div className="blur-background">
    <img src={background} alt="background"/>
   </div>
   <div className="login-info-container">
    <div className="img-container">
      <img rel="preload" src={LoginImg} alt=""/>
    </div>
    <div className="login-button-container">
     <button onClick={()=> setIsLogin(true)} className='btn login-btn'>login</button>
    </div>
   </div>
  </div>
 )
}

export default Login
