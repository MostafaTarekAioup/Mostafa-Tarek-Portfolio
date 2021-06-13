import React  from 'react'
import {useGlopalContext} from '../Context'
const DesktopIcon = ({id , title , icon}) => {
 const { windowOpen ,IconShow} = useGlopalContext()

 return (
  <div className="single-icon"  onClick ={ ()=> {IconShow(id,title,icon) ; windowOpen(id) }} >
          <button> <img  src={icon} alt={title}/></button>
          <br/>
          <p>{title}</p>
  </div>
 )
}

export default DesktopIcon
