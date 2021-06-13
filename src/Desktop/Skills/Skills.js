import React from 'react'
import {useGlopalContext} from '../../Context'
import { FaRegWindowRestore , FaTimes , FaAngleDoubleRight  , FaBootstrap , FaJsSquare , FaHtml5 , FaCss3Alt ,FaGithubSquare , FaReact , FaMapMarkedAlt , FaComments , FaRunning , FaUsers , FaUserCog , FaLanguage} from "react-icons/fa";

import './style.css'
const Skills = () => {
 const {isSkillsActive ,setIsSkillsActive ,taskparicons , setTaskparicons} = useGlopalContext()

 const closeSkillslWindow = ()=>{
  const close = taskparicons.filter((filtericon)=> filtericon.id !== 4) 
  setTaskparicons(close)
  setIsSkillsActive(false)
 }
 return (
  <div className={`${isSkillsActive ? 'window-container skills-window active':'window-container '}`}>
   <div className="header"> 
   <div className="headerbuttons">
    <button className=' heder-icon'  onClick={()=>setIsSkillsActive(false)}><FaRegWindowRestore/></button>
   <button className=' heder-icon'onClick={()=>closeSkillslWindow()}><FaTimes/></button>
   </div>
   </div>
   <div className="portfolio-header">
     <h2>My Skills</h2>
     <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fillOpacity="1" d="M0,32L60,48C120,64,240,96,360,106.7C480,117,600,107,720,90.7C840,75,960,53,1080,53.3C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
    </div>
       <div className="time-line-container">
         <h3 className='skill-flag'>Programming Skills</h3>
          <div className=" course first-course">
            <div className="first-icon course-icon"><FaHtml5/></div>
            <div className="course-detail">
             <h3>HTML</h3>
            
            </div>
            {/* <br /> */}
            <h4 >Sources</h4>
            <div className="moreDetails">
               <p><FaAngleDoubleRight className='detailsIcon'/> Udacity</p>
               <p> <FaAngleDoubleRight className='detailsIcon'/> El-Zero Youtube Channel</p>  
           </div>
          </div>

           <div className=" course first-course">
            <div className="  course-icon"><FaCss3Alt/></div>
            <div className="course-detail">
             <h3>Css</h3>
           
            </div>
            <h4 >Sourses</h4>
            <div className="moreDetails">
           <p><FaAngleDoubleRight className='detailsIcon'/> Udacity</p>
           <p> <FaAngleDoubleRight className='detailsIcon'/> El-Zero Youtube Channel</p>
         </div>
          </div>
          <div className=" course first-course">
            <div className="  course-icon"><FaJsSquare/></div>
            <div className="course-detail">
             <h3>JavaScript</h3>
            </div>
            <h4 >Sourses</h4>
            <div className="moreDetails">
           <p><FaAngleDoubleRight className='detailsIcon'/> Udacity</p>
         </div>
          </div>
          <div className=" course first-course">
            <div className="  course-icon"><FaBootstrap/></div>
            <div className="course-detail">
             <h3>Bootstrap 4/5</h3>
            </div>
            <h4 >Sourses</h4>
            <div className="moreDetails">
           <p><FaAngleDoubleRight className='detailsIcon'/> Bootstrap Documintation</p>
         </div>
          </div>

          <div className=" course first-course">
            <div className="  course-icon"><FaJsSquare/></div>
            <div className="course-detail">
             <h3>Js Dom</h3>
            </div>
            <h4 >Sourses</h4>
            <div className="moreDetails">
           <p><FaAngleDoubleRight className='detailsIcon'/> Udacity</p>
         </div>
          </div>

          <div className=" course first-course">
            <div className="  course-icon"><FaJsSquare/></div>
            <div className="course-detail">
             <h3>Js Bom</h3>
            </div>
            <h4 >Sourses</h4>
            <div className="moreDetails">
           <p><FaAngleDoubleRight className='detailsIcon'/> El-Zero Youtube Channel</p>
         </div>
          </div>

          <div className=" course first-course">
            <div className="  course-icon"><FaJsSquare/></div>
            <div className="course-detail">
             <h3>JSON & AJAX</h3>
            </div>
            <h4 >Sourses</h4>
            <div className="moreDetails">
           <p><FaAngleDoubleRight className='detailsIcon'/> Udacity</p>
         </div>
          </div>

           <div className=" course first-course">
            <div className="  course-icon"><FaJsSquare/></div>
            <div className="course-detail">
             <h3>ES 6</h3>
            </div>
            <h4 >Sourses</h4>
            <div className="moreDetails">
           <p><FaAngleDoubleRight className='detailsIcon'/> Udacity</p>
         </div>
          </div>

          <div className=" course first-course">
            <div className="  course-icon"><FaGithubSquare/></div>
            <div className="course-detail">
             <h3>Git/Github</h3>
            </div>
            <h4 >Sourses</h4>
            <div className="moreDetails">
           <p><FaAngleDoubleRight className='detailsIcon'/> El-Zero Youtube Channel</p>
         </div>
          </div>

          <div className=" course first-course">
            <div className="  course-icon"><FaReact/></div>
            <div className="course-detail">
             <h3>React.js</h3>
            </div>
            <h4 >Sourses</h4>
            <div className="moreDetails">
           <p><FaAngleDoubleRight className='detailsIcon'/> John Smilga React Course Udemy</p>
         </div>
          </div>

          <div className=" course first-course">
            <div className="  course-icon"><FaJsSquare/></div>
            <div className="course-detail">
             <h3>Service Worker For Offline</h3>
            </div>
            <h4 >Sourses</h4>
            <div className="moreDetails">
           <p><FaAngleDoubleRight className='detailsIcon'/> Udacity</p>
         </div>
          </div>


          <div className=" course first-course">
            <div className="  course-icon"><FaJsSquare/></div>
            <div className="course-detail">
             <h3>Js OOP & Js Promises </h3>
            </div>
            <h4 >Sourses</h4>
            <div className="moreDetails">
           <p><FaAngleDoubleRight className='detailsIcon'/> Udacity</p>
           <p><FaAngleDoubleRight className='detailsIcon'/> El-Zero Youtube Channel</p>
         </div>
          </div>


          <div className=" course first-course">
            <div className="  course-icon"><FaMapMarkedAlt/></div>
            <div className="course-detail">
             <h3>Mapbox & Leaflet.js</h3>
            </div>
            <h4 >Sourses</h4>
            <div className="moreDetails">
           <p><FaAngleDoubleRight className='detailsIcon'/> Mapbox Documintation</p>
           <p><FaAngleDoubleRight className='detailsIcon'/> Leaflet.js Documintation</p>
         </div>
          </div>

          {/* ////////////////////////////////// */}

          <h3 className='skill-flag'>SOFT SKILLS</h3>

          <div className=" course first-course">
            <div className="  course-icon"><FaComments/></div>
              <div className="course-detail">
              <h3>COMMUNICATION SKILLS</h3>
              </div>
          </div>

          <div className=" course first-course">
            <div className="  course-icon"><FaRunning/></div>
              <div className="course-detail">
              <h3>MOTIVATED</h3>
              </div>
          </div>

          <div className=" course first-course">
            <div className="  course-icon"><FaUsers/></div>
              <div className="course-detail">
              <h3>CAN WORK IN TEAMS</h3>
              </div>
          </div>

          <div className=" course first-course">
            <div className="  course-icon"><FaUserCog/></div>
              <div className="course-detail">
              <h3>Problem Solving</h3>
              </div>
          </div>

          <h3 className='skill-flag'>LANGUAGES</h3>

          <div className=" course first-course">
            <div className="  course-icon"><FaLanguage/></div>
              <div className="course-detail">
              <h3>Arabic</h3>
              </div>
              <div className="moreDetails">
                <p><FaAngleDoubleRight className='detailsIcon'/> Mother Language</p>
             </div>
          </div>

          <div className=" course first-course">
            <div className="  course-icon"><FaLanguage/></div>
              <div className="course-detail">
              <h3>ENGLISH</h3>
              </div>
              <div className="moreDetails">
                <p><FaAngleDoubleRight className='detailsIcon'/> Professional Working Proficiency</p>
             </div>
          </div>


        </div>
        <br />
<br />
<br />
  </div>
 )
}

export default Skills
