import React, {useEffect  , useRef} from 'react'
import { FaTimes} from "react-icons/fa";
import './style.css'
import {useGlopalContext} from '../Context'
const Submenu = () => {
 const { isSubmenuActive, setIsSubmenuActive,location,submenu:{id ,title,img} , closeFromSubmenu  } = useGlopalContext()

 const container = useRef(null)
useEffect(()=>{
 const subMenu = container.current
 const {centerMenu , topMenu} = location
 subMenu.style.left = `${centerMenu}px`
 subMenu.style.top = `${topMenu}px`
},[location])
 return (
  <div ref={container}  onMouseLeave={()=>setIsSubmenuActive(false)} onMouseEnter={()=>setIsSubmenuActive(true)} className={`${isSubmenuActive? 'show-submenu submenu-container':'submenu-container'}`}>
   <div className="mini-header">
    <div>
     <p className='mini-header-title'>{title}</p>
    </div>
    <div className="headerbuttons">
    <button className='mini-heder-icon' onClick={()=>closeFromSubmenu(id)} ><FaTimes/></button>
   </div>
   </div> 
   <div className="submenu-img">
    <img src={img} alt={title} />
   </div>
   
   
  </div>
 )
}

export default Submenu
