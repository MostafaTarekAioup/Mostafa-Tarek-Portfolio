import React from 'react'
import { SiWindows } from "react-icons/si";
import { FaFacebookF , FaGithub ,FaLinkedin } from "react-icons/fa";
import desktopImg from '../Images/desktop-background.webp'
import {iconsData} from './icons-data'
// import Pages 
import Sidebar from './Sidebar/Sidebar'
import DesktopIcon from './DesktopIcon'
import Portfolio from './Portfolio/Portfolio'
import Personal from './Personal/Personal'
import Contact from './Contactme/Contactme'
import Skills from './Skills/Skills'
import Findme from './FindMe/FindMe'
import './style.css'
import {useGlopalContext} from '../Context'
const Desktop = () => {
const { isSidebar , setIsSidebar, result , activeFromTaskBar  ,setIsSubmenuActive  ,openSubmenu  } = useGlopalContext()
const subMenuData = (e)=>{
    const menuName = e.target.name
    const buttonLocationData = e.target.getBoundingClientRect()
    const centerMenu = ((buttonLocationData.left + buttonLocationData.right)/2)-100
    const topMenu = buttonLocationData.top - 170
    openSubmenu(menuName ,{centerMenu,topMenu })
}
 return (
  <div className='desktop-container'>
   <div className="desktop-background">
    <img src={desktopImg} alt=""/>
   </div>

   <Sidebar/>
   <Portfolio/>
   <Personal/>
   <Contact/>
   <Skills/>
   <Findme/>
    <div className="allicon-container">
     {
      iconsData.map((oneicon)=>{
       return(
        <DesktopIcon key={oneicon.id} {...oneicon}/>
       )
      })
     } 
   </div>
   <footer>
    <div className="navagation-icons">
      <button aria-label='sidebar' onBlur={()=>setIsSidebar(false)}  onClick={()=> setIsSidebar(!isSidebar)} className='icon-btn main-icon'><SiWindows className='icon'/></button>
      <button aria-label='facebook' className='icon-btn main-icon'><a aria-label='facebook' target='_blanck' href="https://www.facebook.com/mostafatarekaioup/"><FaFacebookF className='icon'/></a></button>
      <button aria-label='github' className='icon-btn main-icon'><a aria-label='github' target='_blanck' href="https://github.com/MostafaTarekAioup"><FaGithub className='icon'/></a></button>
      <button aria-label='linkedin' className='icon-btn main-icon'><a aria-label='linkedin' target='_blanck' href="https://www.linkedin.com/in/mostafa-tarek-050936193"><FaLinkedin className='icon'/></a></button>
      {
       result.map((taskicons)=>{
         const { id , icon , title} = taskicons
         return(
          <button aria-label={title} name={title} onMouseLeave={()=>setIsSubmenuActive(false)} onMouseOver={subMenuData} onClick={()=>activeFromTaskBar(id)} className='icon-btn active-icon main-icon ' key={id}><img name={title} className='icon' src={icon} alt={title}/></button>
         )
       })
      }
    </div>
   </footer>
  </div>
 )
}

export default Desktop
