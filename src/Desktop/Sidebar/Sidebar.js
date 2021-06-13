import React from 'react'
import {useGlopalContext} from '../../Context'
import { FaFacebookF , FaGithub ,FaLinkedin } from "react-icons/fa";
import userImg from '../../Images/login-img.webp'
import {iconsData} from '../icons-data'
import './style.css'
const Sidebar = () => {
 const { isSidebar , activeFromTaskBar , setIsSidebar , IconShow} = useGlopalContext()
 return (
  <div className={`${isSidebar?  'sidebar-container active-sidebar' : 'sidebar-container'}`}>
   <div className="sidebar-header">
    <div className="sidebarImgContainer">
      <img src={userImg} alt="MyImage"/>
    </div>
    <div className="userDetails">
     <h4>Mostafa Tarek Mostafa</h4>
     <h5>Front-End Web Developer</h5>
    </div>
   
   </div>
    <div className="line"></div>
  <div className="linksContainer">
   <ul>
    {
     iconsData.map((oneicon)=>{
      const {id , title , icon} = oneicon
      return(
       <li key={id} onClick={()=> {activeFromTaskBar(id) ; IconShow(id, title ,icon) ; setIsSidebar(false) }}><button><img src={icon} alt={title}/>{title}</button></li>
      )
     })
    }
   </ul>
   <div className="social-links">
     <div className="social-container">
        <a href="https://www.facebook.com/mostafatarekaioup/" target='_blanck'><FaFacebookF/></a>
        <a href="https://github.com/MostafaTarekAioup" target='_blanck'><FaGithub/></a>
        <a href="https://www.linkedin.com/in/mostafa-tarek-050936193" target='_blanck'><FaLinkedin/></a>
     </div>
   </div>
  </div>
  </div>
 )
}

export default Sidebar
